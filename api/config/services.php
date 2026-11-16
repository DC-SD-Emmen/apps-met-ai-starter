<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    | De AI-server van de opleiding (OpenAI-compatibele API).
    | De key staat ALLEEN in .env van deze backend, nooit in de app.
    */
    'ai' => [
        'url' => env('AI_BASE_URL', 'https://ai-pc.taile10d2b.ts.net/v1'),
        'key' => env('AI_API_KEY'),
        'model' => env('AI_MODEL', 'gpt-oss:20b'),
        'timeout' => (int) env('AI_TIMEOUT', 90),
        'max_tokens' => (int) env('AI_MAX_TOKENS', 800),
        'limiet_per_gebruiker' => (int) env('AI_LIMIET_PER_GEBRUIKER', 10),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
