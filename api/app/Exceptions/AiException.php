<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Een fout bij het praten met de AI-server, met een melding die je
 * zonder problemen aan de gebruiker van de app kunt laten zien.
 */
class AiException extends Exception
{
    public function __construct(string $melding, public readonly int $status = 502)
    {
        parent::__construct($melding);
    }

    /** Laravel roept dit automatisch aan als de exception niet wordt afgevangen. */
    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], $this->status);
    }
}
