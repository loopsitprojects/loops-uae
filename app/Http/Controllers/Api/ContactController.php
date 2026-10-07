<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ContactSubmissionRequest;
use App\Mail\InquiryReceived;
use App\Mail\InquiryThankYou;
use App\Models\ContactSubmission;
use App\Services\RecaptchaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(ContactSubmissionRequest $request): JsonResponse
    {
        if (!RecaptchaService::verify($request->input('recaptcha_token'), $request->ip())) {
            return response()->json(['message' => 'reCAPTCHA verification failed. Please try again.'], 422);
        }
        $submission = ContactSubmission::create([
            'name'           => $request->name,
            'email'          => $request->email,
            'company'        => $request->company,
            'service'        => $request->service,
            'message'        => $request->message,
            'office_context' => $request->office_context,
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);

        // Send email notification for all inquiries to admin / recipient
        try {
            $recipient = config('mail.inquiry_recipient', env('INQUIRY_RECIPIENT_EMAIL', 'hello@loopsintegrated.com'));
            Mail::to($recipient)->send(new InquiryReceived($submission));
        } catch (\Throwable $e) {
            Log::error('Failed sending inquiry notification email', [
                'submission_id' => $submission->id,
                'error'         => $e->getMessage(),
            ]);
        }

        // Send auto-responder "Thank You" email to the user
        try {
            Mail::to($submission->email)->send(new InquiryThankYou($submission));
        } catch (\Throwable $e) {
            Log::error('Failed sending user thank you email', [
                'submission_id' => $submission->id,
                'user_email'    => $submission->email,
                'error'         => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Thank you! We\'ll be in touch within one business day.',
        ], 201);
    }
}


