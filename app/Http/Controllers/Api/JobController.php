<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use App\Services\RecaptchaService;
use App\Mail\JobApplicationSubmitted;
use App\Mail\JobApplicationThankYou;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class JobController extends Controller
{
    public function index(): JsonResponse
    {
        $jobs = Job::where('published', true)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $jobs]);
    }

    public function departments(): JsonResponse
    {
        $departments = \App\Models\JobDepartment::orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $departments]);
    }

    public function apply(Request $request, int $id): JsonResponse
    {
        if (!RecaptchaService::verify($request->input('recaptcha_token'), $request->ip())) {
            return response()->json(['message' => 'reCAPTCHA verification failed. Please try again.'], 422);
        }

        $job = Job::where('id', $id)->where('published', true)->first();
        if (!$job) {
            return response()->json(['message' => 'Job posting not found.'], 404);
        }

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'phone'           => 'required|string|max:50',
            'expected_salary' => 'required|string|max:255',
            'portfolio'       => 'nullable|string|max:255',
            'cover_letter'    => 'nullable|string',
            'cv'              => 'required|file|mimes:pdf,doc,docx|max:10240', // Max 10MB CV upload
        ]);

        $cvPath = null;
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            if ($file && $file->isValid()) {
                $extension = strtolower($file->getClientOriginalExtension()) ?: 'pdf';
                $sanitizedName = preg_replace('/[^A-Za-z0-9_-]/', '_', $validated['name']);
                $filename = time() . '_' . $sanitizedName . '_CV.' . $extension;

                $contents = file_get_contents($file->getRealPath());

                // 1. Save to storage/app/public/cv/ (public storage disk)
                Storage::disk('public')->put('cv/' . $filename, $contents);

                // 2. Save directly to public/cv/ directory
                $publicCvDir = public_path('cv');
                if (!file_exists($publicCvDir)) {
                    @mkdir($publicCvDir, 0777, true);
                }
                @file_put_contents($publicCvDir . '/' . $filename, $contents);

                // 3. Save directly to storage/cv/ directory
                $storageCvDir = storage_path('cv');
                if (!file_exists($storageCvDir)) {
                    @mkdir($storageCvDir, 0777, true);
                }
                @file_put_contents($storageCvDir . '/' . $filename, $contents);

                $cvPath = 'cv/' . $filename;
            }
        }

        $application = JobApplication::create([
            'job_id'          => $job->id,
            'name'            => $validated['name'],
            'email'           => $validated['email'],
            'phone'           => $validated['phone'],
            'expected_salary' => $validated['expected_salary'],
            'portfolio'       => $validated['portfolio'] ?? null,
            'cover_letter'    => $validated['cover_letter'] ?? null,
            'cv_path'         => $cvPath,
            'status'          => 'new',
        ]);

        if ($request->hasFile('cv')) {
            try {
                $application->addMediaFromRequest('cv')
                    ->toMediaCollection('cv');
            } catch (\Throwable $e) {
                Log::warning('Spatie MediaLibrary upload skipped or failed, relying on direct cv storage', ['error' => $e->getMessage()]);
            }
        }

        $application->refresh();

        // Send email notification to careers@loopsintegrated.com
        try {
            $recipient = config('mail.careers_recipient', env('CAREERS_RECIPIENT_EMAIL', 'careers@loopsintegrated.com'));
            Mail::to($recipient)->send(new JobApplicationSubmitted($application, $job));
        } catch (\Throwable $e) {
            Log::error('Failed sending job application notification email', [
                'application_id' => $application->id,
                'error'          => $e->getMessage(),
            ]);
        }

        // Send confirmation/thank you email to candidate using dedicated careers SMTP
        try {
            Mail::mailer('careers')->to($application->email)->send(new JobApplicationThankYou($application, $job));
        } catch (\Throwable $e) {
            Log::error('Failed sending candidate job application thank you email', [
                'application_id' => $application->id,
                'user_email'    => $application->email,
                'error'         => $e->getMessage(),
            ]);
        }

        // Dispatch candidate and CV details to loops-hr webhook
        $this->sendToLoopsHrWebhook($application, $job);

        return response()->json([
            'message' => 'Application submitted successfully!',
            'data'    => $application
        ], 201);
    }

    /**
     * Send candidate details and CV URL to loops-hr webhook
     */
    private function sendToLoopsHrWebhook(JobApplication $application, Job $job): void
    {
        $webhookUrl = config('services.loops_hr.webhook_url') ?: env('LOOPS_HR_WEBHOOK_URL', 'http://127.0.0.1:8001/api/webhook/wpforms');

        if (empty($webhookUrl)) {
            return;
        }

        try {
            $rawCvUrl = $application->cv_url ?: $application->getFirstMediaUrl('cv');
            $cvUrl = null;

            if ($rawCvUrl) {
                if (str_starts_with($rawCvUrl, 'http://') || str_starts_with($rawCvUrl, 'https://')) {
                    $cvUrl = $rawCvUrl;
                } else {
                    $cvUrl = url($rawCvUrl);
                }
            }

            $payload = [
                'application_id'   => $application->id,
                'name'             => $application->name,
                'full_name'        => $application->name,
                'email'            => $application->email,
                'phone'            => $application->phone,
                'contact_number'   => $application->phone,
                'phone_number'     => $application->phone,
                'expected_salary'  => $application->expected_salary,
                'salary'           => $application->expected_salary,
                'portfolio'        => $application->portfolio,
                'portfolio_url'    => $application->portfolio,
                'cover_letter'     => $application->cover_letter,
                'message'          => $application->cover_letter,
                'status'           => $application->status,
                'job_id'           => $job->id,
                'post_name'        => $job->title ?? null,
                'designation'      => $job->title ?? null,
                'job_title'        => $job->title ?? null,
                'title'            => $job->title ?? null,
                'department'       => $job->department ?? null,
                'location'         => $job->location ?? null,
                'type'             => $job->type ?? null,
                'job_type'         => $job->type ?? null,
                'experience_level' => $job->experience_level ?? null,
                'upload_your_cv'   => $cvUrl ?: null,
                'cv'               => $cvUrl ?: null,
                'cv_url'           => $cvUrl ?: null,
                'resume'           => $cvUrl ?: null,
                'resume_url'       => $cvUrl ?: null,
                'submitted_at'     => $application->created_at ? $application->created_at->toIso8601String() : date('c'),
            ];

            $headers = [
                'User-Agent' => 'LoopsWebsite/1.0',
                'Accept'     => 'application/json',
            ];

            $token = config('services.loops_hr.webhook_token') ?: env('LOOPS_HR_WEBHOOK_TOKEN');
            if ($token) {
                $headers['X-Webhook-Token'] = $token;
            }

            $response = Http::withHeaders($headers)
                ->withoutVerifying()
                ->timeout(30)
                ->post($webhookUrl, $payload);

            if ($response->successful()) {
                Log::info('Successfully sent job application webhook to loops-hr', [
                    'application_id'    => $application->id,
                    'loops_hr_response' => $response->json(),
                ]);
            } else {
                Log::warning('Failed sending job application webhook to loops-hr', [
                    'status'      => $response->status(),
                    'webhook_url' => $webhookUrl,
                    'response'    => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception sending job application webhook to loops-hr', [
                'webhook_url' => $webhookUrl,
                'error'       => $e->getMessage(),
                'trace'       => $e->getTraceAsString(),
            ]);
        }
    }
}
