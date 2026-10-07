<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    public static function verify(?string $token, ?string $ip = null): bool
    {
        $secret = config('services.recaptcha.secret');
        if (empty($secret)) {
            // If secret is not configured in environment, skip verification gracefully
            return true;
        }

        if (empty($token)) {
            return false;
        }

        try {
            $response = Http::asForm()->timeout(10)->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => $secret,
                'response' => $token,
                'remoteip' => $ip,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $minScore = (float) config('services.recaptcha.min_score', 0.5);
                $success = ($data['success'] ?? false) && (($data['score'] ?? 0) >= $minScore);

                if (!$success) {
                    Log::warning('reCAPTCHA v3 verification failed', [
                        'data' => $data,
                        'ip'   => $ip,
                    ]);
                }

                return $success;
            }
        } catch (\Throwable $e) {
            Log::error('reCAPTCHA v3 API verification exception', [
                'error' => $e->getMessage(),
            ]);
        }

        return false;
    }
}
