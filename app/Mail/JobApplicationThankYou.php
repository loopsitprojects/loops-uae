<?php

namespace App\Mail;

use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class JobApplicationThankYou extends Mailable
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
        $jobTitle = $this->job->title ?? 'Position';
        $fromAddress = config('mail.careers_from.address', env('CAREERS_MAIL_FROM_ADDRESS', 'careers@loopsintegrated.com'));
        $fromName = config('mail.careers_from.name', env('CAREERS_MAIL_FROM_NAME', 'Loops HR'));

        return new Envelope(
            from: new Address($fromAddress, $fromName),
            subject: "Thank you for applying for {$jobTitle} at Loops Integrated",
            replyTo: [
                new Address($fromAddress, $fromName),
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
            view: 'emails.job_application_thank_you',
            with: [
                'application' => $this->application,
                'job'         => $this->job,
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
        return [];
    }
}
