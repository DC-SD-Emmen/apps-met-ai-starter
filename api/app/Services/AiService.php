<?php

namespace App\Services;

use App\Exceptions\AiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Praat met de AI-server van de opleiding.
 *
 * De server spreekt dezelfde API als OpenAI. Alles wat je hier leert,
 * werkt dus ook bij OpenAI, Azure en andere aanbieders.
 */
class AiService
{
    /**
     * Stuur een gesprek naar het taalmodel en geef het antwoord terug.
     *
     * @param  array<int, array{role: string, content: mixed}>  $berichten  Berichten van gebruiker en assistent, oudste eerst.
     */
    public function chat(array $berichten, ?string $model = null): string
    {
        $geschiedenis = array_slice($berichten, -config('assistent.max_geschiedenis'));

        $antwoord = $this->verzoek(fn (PendingRequest $http) => $http->post('/chat/completions', [
            'model' => $model ?? config('services.ai.model'),
            'messages' => [
                ['role' => 'system', 'content' => config('assistent.systeemprompt')],
                ...$geschiedenis,
            ],
            'max_tokens' => config('services.ai.max_tokens'),
        ]));

        return trim((string) $antwoord->json('choices.0.message.content'));
    }

    /**
     * Welke modellen mag deze key gebruiken? Handig om de verbinding te testen.
     *
     * @return array<int, string>
     */
    public function modellen(): array
    {
        $antwoord = $this->verzoek(fn (PendingRequest $http) => $http->get('/models'));

        return array_column($antwoord->json('data', []), 'id');
    }

    /**
     * Voert een verzoek uit en vertaalt fouten naar begrijpelijke meldingen.
     */
    private function verzoek(callable $doe): \Illuminate\Http\Client\Response
    {
        if (! config('services.ai.key')) {
            throw new AiException('De AI-server is niet ingesteld: AI_API_KEY ontbreekt in .env.', 500);
        }

        $http = Http::baseUrl(rtrim(config('services.ai.url'), '/'))
            ->withToken(config('services.ai.key'))
            ->acceptJson()
            ->timeout(config('services.ai.timeout'))
            // Bij 429 (limiet bereikt) of een tijdelijke serverfout één keer opnieuw proberen.
            ->retry(2, 3000, fn ($fout) => $fout instanceof RequestException
                && in_array($fout->response->status(), [429, 502, 503], true), throw: false);

        try {
            $antwoord = $doe($http);
        } catch (ConnectionException $fout) {
            Log::warning('AI-server niet bereikbaar', ['fout' => $fout->getMessage()]);
            throw new AiException('De AI-server is nu niet bereikbaar. Probeer het over een minuut opnieuw.', 503);
        }

        if ($antwoord->successful()) {
            return $antwoord;
        }

        Log::warning('AI-server gaf een fout', ['status' => $antwoord->status(), 'body' => $antwoord->body()]);

        throw match ($antwoord->status()) {
            401 => new AiException('De API-key van de server klopt niet. Meld dit bij je docent.', 500),
            403 => new AiException('Dit model mag niet gebruikt worden met deze API-key.', 500),
            429 => new AiException('Het is even te druk. Wacht een minuut en probeer het opnieuw.', 429),
            default => new AiException('De AI kon nu geen antwoord geven. Probeer het later opnieuw.', 502),
        };
    }
}
