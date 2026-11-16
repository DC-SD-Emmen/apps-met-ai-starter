<?php

namespace App\Http\Controllers;

use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Het "walking skeleton": één vraag van de app naar de AI en terug.
 *
 * De app stuurt nu zelf de hele geschiedenis mee en er wordt nog niets
 * opgeslagen. Gesprekken bewaren in de database is ticket API-2 en API-3
 * in BACKLOG.md.
 */
class ChatController extends Controller
{
    public function __invoke(Request $request, AiService $ai): JsonResponse
    {
        $gegevens = $request->validate([
            'berichten' => ['required', 'array', 'min:1', 'max:50'],
            'berichten.*.role' => ['required', 'in:user,assistant'],
            'berichten.*.content' => ['required', 'string', 'max:4000'],
        ]);

        $antwoord = $ai->chat($gegevens['berichten']);

        return response()->json([
            'role' => 'assistant',
            'content' => $antwoord,
        ]);
    }

    /** Test of de backend de AI-server kan bereiken. */
    public function status(AiService $ai): JsonResponse
    {
        return response()->json([
            'verbonden' => true,
            'model' => config('services.ai.model'),
            'beschikbare_modellen' => $ai->modellen(),
        ]);
    }
}
