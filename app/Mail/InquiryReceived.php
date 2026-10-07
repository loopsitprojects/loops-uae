<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class InquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    public ContactSubmission $submission;

    /**
     * Create a new message instance.
     */
    public function __construct(ContactSubmission $submission)
    {
        $this->submission = $submission;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $serviceInfo = $this->submission->service ? " - {$this->submission->service}" : '';

        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: "New Website Inquiry from {$this->submission->name}{$serviceInfo}",
            replyTo: [
                new Address($this->submission->email, $this->submission->name),
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
            view: 'emails.inquiry_received',
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
