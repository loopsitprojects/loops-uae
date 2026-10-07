<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'loops_hr' => [
        'webhook_url' => env('LOOPS_HR_WEBHOOK_URL', 'http://127.0.0.1:8001/api/webhook/wpforms'),
        'webhook_token' => env('LOOPS_HR_WEBHOOK_TOKEN'),
    ],

    'newsletter_webhook' => [
        'url' => env('NEWSLETTER_WEBHOOK_URL'),
        'token' => env('NEWSLETTER_WEBHOOK_TOKEN'),
        'secret' => env('NEWSLETTER_WEBHOOK_SECRET'),
        'enabled' => env('NEWSLETTER_WEBHOOK_ENABLED', true),
    ],

    'admin_otp' => [
        'recipient_email' => env('ADMIN_OTP_RECIPIENT_EMAIL'),
    ],

    'filament' => [
        'path' => env('FILAMENT_PANEL_PATH', 'loops-internal-portal'),
    ],

    'recaptcha' => [
        'site_key'  => env('RECAPTCHA_SITE_KEY', env('VITE_RECAPTCHA_SITE_KEY')),
        'secret'    => env('RECAPTCHA_SECRET_KEY'),
        'min_score' => env('RECAPTCHA_MIN_SCORE', 0.5),
    ],

];
