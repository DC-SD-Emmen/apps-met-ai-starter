<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

/**
 * Registreren, inloggen en uitloggen met Laravel Sanctum.
 *
 * De app krijgt bij registreren en inloggen een token terug. Dat token
 * bewaart de app veilig (SecureStore) en stuurt het mee bij elk verzoek:
 *   Authorization: Bearer <token>
 */
class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $gegevens = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::min(8)],
        ]);

        $gebruiker = User::create($gegevens);

        return response()->json([
            'user' => $gebruiker,
            'token' => $gebruiker->createToken($this->apparaat($request))->plainTextToken,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $gegevens = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $gebruiker = User::where('email', $gegevens['email'])->first();

        if (! $gebruiker || ! Hash::check($gegevens['password'], $gebruiker->password)) {
            throw ValidationException::withMessages([
                'email' => 'E-mailadres of wachtwoord klopt niet.',
            ]);
        }

        return response()->json([
            'user' => $gebruiker,
            'token' => $gebruiker->createToken($this->apparaat($request))->plainTextToken,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        // Alleen het token van dit apparaat intrekken.
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Je bent uitgelogd.']);
    }

    private function apparaat(Request $request): string
    {
        return substr((string) $request->input('device_name', 'app'), 0, 100);
    }
}
