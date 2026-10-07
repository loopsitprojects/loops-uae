<?php

namespace Tests\Feature;

use App\Mail\InquiryReceived;
use App\Mail\InquiryThankYou;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactInquiryEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_submitting_contact_form_sends_inquiry_email(): void
    {
        Mail::fake();

        $payload = [
            'name'           => 'Jane Doe',
            'email'          => 'jane@gmail.com',
            'company'        => 'Acme Corp',
            'service'        => 'Digital',
            'message'        => 'Interested in website redesign and branding strategy.',
            'office_context' => 'Colombo',
        ];

        $response = $this->postJson('/api/v1/contact', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => "Thank you! We'll be in touch within one business day.",
                 ]);

        $this->assertDatabaseHas('contact_submissions', [
            'name'    => 'Jane Doe',
            'email'   => 'jane@gmail.com',
            'company' => 'Acme Corp',
        ]);

        $expectedRecipient = config('mail.inquiry_recipient');

        Mail::assertSent(InquiryReceived::class, function (InquiryReceived $mail) use ($expectedRecipient) {
            return $mail->hasTo($expectedRecipient) &&
                   $mail->submission->name === 'Jane Doe' &&
                   $mail->submission->email === 'jane@gmail.com';
        });

        Mail::assertSent(InquiryThankYou::class, function (InquiryThankYou $mail) {
            return $mail->hasTo('jane@gmail.com') &&
                   $mail->submission->name === 'Jane Doe';
        });
    }
}
