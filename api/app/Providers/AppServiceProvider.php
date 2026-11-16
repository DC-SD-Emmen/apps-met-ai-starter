<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // De hele app deelt één API-key met een limiet van 20 verzoeken per minuut.
        // Daarom krijgt elke gebruiker een eigen, kleinere limiet.
        RateLimiter::for('ai', function (Request $request) {
            return Limit::perMinute(config('services.ai.limiet_per_gebruiker'))
                ->by($request->user()?->id ?: $request->ip())
                ->response(fn () => response()->json([
                    'message' => 'Je stelt te veel vragen achter elkaar. Wacht even en probeer het opnieuw.',
                ], 429));
        });

        RateLimiter::for('inloggen', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
