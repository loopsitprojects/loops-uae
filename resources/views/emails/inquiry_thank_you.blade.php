<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Loops Integrated</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0b0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e4e4e7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0b0e; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #141419; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
                    
                    <!-- Header with Official Embedded Logo -->
                    <tr>
                        <td align="center" style="background-color: #000000; padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                            @if(file_exists(public_path('images/logo.png')))
                                <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="Loops Integrated" width="200" style="display: block; width: 200px; max-width: 100%; height: auto; margin: 0 auto; border: 0;" />
                            @else
                                <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">LOOPS <span style="color: #e8005a;">INTEGRATED</span></h1>
                            @endif
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                                Thank You, {{ $submission->name }}!
                            </h2>

                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #a1a1aa;">
                                We have received your inquiry and our team is already reviewing it. We appreciate you reaching out to <strong style="color: #ffffff;">Loops Integrated</strong>, and we will get back to you within <strong style="color: #e8005a;">one business day</strong>.
                            </p>

                            <!-- Submission Summary Card -->
                            <div style="background-color: #0b0b0e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 28px;">
                                <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #71717a;">
                                    Summary of Your Inquiry
                                </h3>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    @if($submission->service)
                                    <tr>
                                        <td width="35%" style="padding: 6px 0; font-size: 13px; color: #71717a; font-weight: 500;">Service:</td>
                                        <td width="65%" style="padding: 6px 0; font-size: 14px; color: #ffffff; font-weight: 600;">{{ $submission->service }}</td>
                                    </tr>
                                    @endif

                                    @if($submission->company)
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 13px; color: #71717a; font-weight: 500;">Company:</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #e4e4e7;">{{ $submission->company }}</td>
                                    </tr>
                                    @endif

                                    <tr>
                                        <td style="padding: 6px 0; font-size: 13px; color: #71717a; font-weight: 500;">Date Received:</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">{{ $submission->created_at ? $submission->created_at->format('F j, Y') : now()->format('F j, Y') }}</td>
                                    </tr>
                                </table>

                                <div style="margin-top: 16px; pt: 16px; border-top: 1px solid rgba(255,255,255,0.06);">
                                    <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; margin-bottom: 8px;">
                                        Your Message:
                                    </span>
                                    <div style="font-size: 14px; line-height: 1.6; color: #d4d4d8; font-style: italic; white-space: pre-wrap;">"{{ $submission->message }}"</div>
                                </div>
                            </div>

                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                                If you have any urgent questions, feel free to reply directly to this email or visit our website at <a href="{{ config('app.url') }}" style="color: #e8005a; text-decoration: none;">loopsintegrated.com</a>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0b0b0e; padding: 24px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #52525b; line-height: 1.5;">
                            &copy; {{ date('Y') }} <strong>Loops Integrated</strong>. All rights reserved.<br />
                            Creative • Digital • Tech • Play • AI Content • Events & Experiences
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
