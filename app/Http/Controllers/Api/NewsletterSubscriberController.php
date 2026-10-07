<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Services\RecaptchaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterSubscriberController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        if (!RecaptchaService::verify($request->input('recaptcha_token'), $request->ip())) {
            return response()->json([
                'success' => false,
                'message' => 'reCAPTCHA verification failed. Please try again.',
            ], 422);
        }
        $validator = Validator::make($request->all(), [
            'email'  => 'required|email|max:255',
            'source' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid email address.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim($request->input('email')));
        $source = $request->input('source', 'website');
        $ip = $request->ip();

        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if ($subscriber) {
            if ($subscriber->status !== 'subscribed') {
                $subscriber->update([
                    'status' => 'subscribed',
                    'source' => $source,
                    'ip_address' => $ip,
                ]);
            }

            \App\Services\NewsletterWebhookService::send($subscriber, 'subscriber.updated');

            return response()->json([
                'success' => true,
                'message' => 'You are already subscribed to our newsletter!',
                'data'    => $subscriber,
            ]);
        }

        $subscriber = NewsletterSubscriber::create([
            'email'          => $email,
            'status'         => 'subscribed',
            'source'         => $source,
            'ip_address'     => $ip,
            'webhook_status' => 'pending',
        ]);

        \App\Services\NewsletterWebhookService::send($subscriber, 'subscriber.created');

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing to our newsletter!',
            'data'    => $subscriber,
        ], 201);
    }
}
