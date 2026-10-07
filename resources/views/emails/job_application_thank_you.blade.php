<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Applying - Loops Integrated</title>
</head>

<body
    style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%"
                    style="max-width: 650px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">

                    <!-- Header with Official Embedded Logo -->
                    <tr>
                        <td align="center"
                            style="background-color: #000000; padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                            @if(file_exists(public_path('images/logo.png')))
                                <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="Loops Integrated"
                                    width="200"
                                    style="display: block; width: 200px; max-width: 100%; height: auto; margin: 0 auto; border: 0;" />
                            @else
                                <h1
                                    style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                    LOOPS <span style="color: #e8005a;">INTEGRATED</span></h1>
                            @endif
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td align="center" style="padding: 40px 36px; text-align: center;">
                            <h2
                                style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.3px; text-align: center;">
                                Thank You for Applying, {{ $application->name }}!
                            </h2>

                            <p style="margin: 0 auto 20px auto; max-width: 580px; font-size: 15px; line-height: 1.7; color: #374151; text-align: center; text-wrap: balance;">
                                We’re excited to let you know that your application for the <strong
                                    style="color: #111827;">{{ $job->title ?? 'Position' }}</strong> position at <strong
                                    style="color: #e8005a;">Loops Integrated</strong> has been successfully&nbsp;received.
                            </p>

                            <p style="margin: 0 auto 20px auto; max-width: 580px; font-size: 15px; line-height: 1.7; color: #4b5563; text-align: center; text-wrap: balance;">
                                Our Talent Acquisition team is carefully reviewing your application and experience. If your profile aligns with what we’re looking for, we’ll be in touch soon to discuss the next steps in your journey with&nbsp;us.
                            </p>

                            <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.7; color: #374151; text-align: center;">
                                Thank you for your interest in Loops Integrated.
                            </p>

                            <!-- Application Details Box -->
                            <div
                                style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 28px; text-align: center;">
                                <h3
                                    style="margin: 0 0 16px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; text-align: center;">
                                    Application Details
                                </h3>

                                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto; text-align: left;">
                                    <tr>
                                        <td style="padding: 6px 16px 6px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-align: left; white-space: nowrap;">
                                            Position:
                                        </td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 700; text-align: left;">
                                            {{ $job->title ?? 'N/A' }}
                                        </td>
                                    </tr>
                                    @if(!empty($job->department))
                                        <tr>
                                            <td style="padding: 6px 16px 6px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-align: left; white-space: nowrap;">
                                                Department:
                                            </td>
                                            <td style="padding: 6px 0; font-size: 14px; color: #374151; font-weight: 500; text-align: left;">
                                                {{ $job->department }}
                                            </td>
                                        </tr>
                                    @endif
                                    <tr>
                                        <td style="padding: 6px 16px 6px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-align: left; white-space: nowrap;">
                                            Date Submitted:
                                        </td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #374151; font-weight: 500; text-align: left;">
                                            {{ $application->created_at ? $application->created_at->format('F j, Y') : now()->format('F j, Y') }}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                                In the meantime, feel free to explore more about our work, culture, and team at <a
                                    href="{{ config('app.url') }}"
                                    style="color: #e85d04; text-decoration: underline;">loopsintegrated.com</a>.
                            </p>

                            <!-- Signature -->
                            <div
                                style="padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #374151; text-align: center;">
                                Best regards,<br />
                                <strong style="color: #111827;">Loops HR Team</strong><br />
                                <span style="color: #6b7280;">Loops Integrated</span>
                            </div>

                            <!-- Automated Email Note -->
                            <p style="margin-top: 24px; margin-bottom: 0; font-size: 13px; color: #6b7280; font-style: italic; text-align: center;">
                                Please note: This is an automated email. Kindly do not reply to this message.
                            </p>

                            <!-- Footer note -->
                            <div style="margin-top: 28px; text-align: center; font-size: 13px; color: #9ca3af;">
                                Sent from <a href="{{ config('app.url') }}"
                                    style="color: #6b7280; text-decoration: underline;">Loops Integrated</a>
                            </div>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>