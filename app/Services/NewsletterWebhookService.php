<?php

namespace App\Services;

use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsletterWebhookService
{
    /**
     * Dispatch newsletter subscriber to external webhook URL.
     */
    public static function send(NewsletterSubscriber $subscriber, string $event = 'subscriber.created'): array
    {
        $enabled = config('services.newsletter_webhook.enabled', true);
        $url = config('services.newsletter_webhook.url') ?: env('NEWSLETTER_WEBHOOK_URL');

        if (!$enabled || empty($url)) {
            Log::info('Newsletter webhook skipped: URL not configured or webhook disabled.', [
                'subscriber_id' => $subscriber->id,
                'email'         => $subscriber->email,
            ]);

            return [
                'success' => false,
                'skipped' => true,
                'message' => 'Webhook URL is not configured.',
            ];
        }

        $payload = [
            'event'         => $event,
            'id'            => $subscriber->id,
            'email'         => $subscriber->email,
            'status'        => $subscriber->status,
            'source'        => $subscriber->source ?: 'website',
            'ip_address'    => $subscriber->ip_address,
            'subscribed_at' => $subscriber->created_at ? $subscriber->created_at->toIso8601String() : now()->toIso8601String(),
            'timestamp'     => now()->toIso8601String(),
            'data'          => [
                'email'  => $subscriber->email,
                'status' => $subscriber->status,
                'source' => $subscriber->source ?: 'website',
            ],
        ];

        $headers = [
            'Content-Type'    => 'application/json',
            'Accept'          => 'application/json',
            'User-Agent'      => 'LoopsWebsite/1.0 (NewsletterWebhook)',
            'X-Webhook-Event' => $event,
        ];

        $token = config('services.newsletter_webhook.token') ?: env('NEWSLETTER_WEBHOOK_TOKEN');
        if (!empty($token)) {
            $headers['Authorization'] = 'Bearer ' . $token;
            $headers['X-Webhook-Token'] = $token;
        }

        $secret = config('services.newsletter_webhook.secret') ?: env('NEWSLETTER_WEBHOOK_SECRET');
        if (!empty($secret)) {
            $headers['X-Webhook-Signature'] = hash_hmac('sha256', json_encode($payload), $secret);
        }

        try {
            $response = Http::withHeaders($headers)
                ->withoutVerifying()
                ->timeout(10)
                ->post($url, $payload);

            if ($response->successful()) {
                $subscriber->updateQuietly([
                    'webhook_status'    => 'synced',
                    'webhook_synced_at' => now(),
                    'webhook_response'  => substr($response->body(), 0, 1000),
                ]);

                Log::info('Successfully dispatched subscriber to newsletter webhook', [
                    'subscriber_id' => $subscriber->id,
                    'email'         => $subscriber->email,
                    'url'           => $url,
                    'status'        => $response->status(),
                ]);

                return [
                    'success' => true,
                    'status'  => $response->status(),
                    'body'    => $response->json() ?? $response->body(),
                ];
            }

            $errMsg = 'HTTP ' . $response->status() . ': ' . substr($response->body(), 0, 500);
            $subscriber->updateQuietly([
                'webhook_status'   => 'failed',
                'webhook_response' => $errMsg,
            ]);

            Log::warning('Newsletter webhook responded with error', [
                'subscriber_id' => $subscriber->id,
                'email'         => $subscriber->email,
                'url'           => $url,
                'status'        => $response->status(),
                'response'      => $response->body(),
            ]);

            return [
                'success' => false,
                'status'  => $response->status(),
                'error'   => $errMsg,
            ];
        } catch (\Throwable $e) {
            $errMsg = 'Exception: ' . $e->getMessage();
            $subscriber->updateQuietly([
                'webhook_status'   => 'failed',
                'webhook_response' => $errMsg,
            ]);

            Log::error('Exception while sending newsletter webhook', [
                'subscriber_id' => $subscriber->id,
                'email'         => $subscriber->email,
                'url'           => $url,
                'error'         => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error'   => $errMsg,
            ];
        }
    }
}
