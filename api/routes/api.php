<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API-routes voor de app
|--------------------------------------------------------------------------
| Alle routes hier beginnen automatisch met /api.
*/

// Openbaar: registreren en inloggen (met een limiet tegen raden van wachtwoorden)
Route::middleware('throttle:inloggen')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Alleen voor ingelogde gebruikers (token via Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/ai/status', [ChatController::class, 'status']);

    // Elke gebruiker mag een beperkt aantal AI-vragen per minuut stellen
    Route::post('/chat', ChatController::class)->middleware('throttle:ai');

    // Ticket API-2 en API-3: routes voor gesprekken komen hier.
});
