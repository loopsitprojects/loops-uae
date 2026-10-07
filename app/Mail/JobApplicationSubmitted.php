<?php

namespace App\Mail;

use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class JobApplicationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public JobApplication $application;
    public Job $job;

    /**
     * Create a new message instance.
     */
    public function __construct(JobApplication $application, Job $job)
    {
        $this->application = $application;
        $this->job = $job;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $jobTitle = $this->job->title ?? 'General Position';
        $applicantName = $this->application->name ?? 'Applicant';

        return new Envelope(
            from: new Address(config('mail.from.address', 'hello@loopsintegrated.com'), config('mail.from.name', 'Loops Integrated')),
            subject: "New Job Application: {$jobTitle} - {$applicantName}",
            replyTo: [
                new Address($this->application->email, $this->application->name),
            ],
        );
    }

    /**
     * Get the message headers.
     */
    public function headers(): Headers
    {
        return new Headers(
            text: [
                'X-Mailer'                 => 'LoopsIntegrated Website Engine',
                'X-Priority'               => '1 (Highest)',
                'Importance'               => 'High',
                'X-Auto-Response-Suppress' => 'OOF, AutoReply',
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.job_application_submitted',
            with: [
                'application' => $this->application,
                'job'         => $this->job,
                'cvUrl'       => $this->application->cv_url,
                'cvFilename'  => $this->application->cv_path ? basename($this->application->cv_path) : 'CV.pdf',
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        $possiblePaths = [];
        if ($this->application->cv_path) {
            $path = ltrim($this->application->cv_path, '/');
            $possiblePaths[] = public_path($path);
            $possiblePaths[] = storage_path('app/public/' . $path);
            $possiblePaths[] = storage_path($path);
        }

        try {
            $mediaPath = $this->application->getFirstMediaPath('cv');
            if ($mediaPath) {
                $possiblePaths[] = $mediaPath;
            }
        } catch (\Throwable $e) {
            // Ignore media library exception
        }

        foreach ($possiblePaths as $filePath) {
            if ($filePath && file_exists($filePath) && is_file($filePath)) {
                $filename = basename($filePath);
                $attachments[] = Attachment::fromPath($filePath)->as($filename);
                break;
            }
        }

        return $attachments;
    }
}
