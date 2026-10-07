<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Website Inquiry</title>
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

                    <!-- Body -->
                    <tr>
                        <td style="padding: 36px 40px;">
                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
                                You have received a new inquiry submitted through the website contact form.
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                                <!-- Name -->
                                <tr>
                                    <td width="35%" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                                        Full Name
                                    </td>
                                    <td width="65%" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: 600; color: #ffffff;">
                                        {{ $submission->name }}
                                    </td>
                                </tr>

                                <!-- Email -->
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                                        Email Address
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; color: #e8005a;">
                                        <a href="mailto:{{ $submission->email }}" style="color: #e8005a; text-decoration: none; font-weight: 500;">{{ $submission->email }}</a>
                                    </td>
                                </tr>

                                <!-- Company -->
                                @if($submission->company)
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                                        Company
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; color: #e4e4e7;">
                                        {{ $submission->company }}
                                    </td>
                                </tr>
                                @endif

                                <!-- Service -->
                                @if($submission->service)
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                                        Interested Service
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; color: #e4e4e7;">
                                        <span style="display: inline-block; background-color: rgba(232,0,90,0.15); color: #ff5292; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                                            {{ $submission->service }}
                                        </span>
                                    </td>
                                </tr>
                                @endif

                                <!-- Office Context -->
                                @if($submission->office_context)
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                                        Office Context
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; color: #e4e4e7;">
                                        {{ $submission->office_context }}
                                    </td>
                                </tr>
                                @endif

                                <!-- Timestamp -->
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                                        Date & Time
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #a1a1aa;">
                                        {{ $submission->created_at ? $submission->created_at->format('F j, Y \a\t g:i A T') : now()->format('F j, Y \a\t g:i A T') }}
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Section -->
                            <div style="margin-top: 24px;">
                                <label style="display: block; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; margin-bottom: 10px;">
                                    Message
                                </label>
                                <div style="background-color: #0b0b0e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.7; color: #f4f4f5; white-space: pre-wrap;">{{ $submission->message }}</div>
                            </div>

                            <!-- Action Button -->
                            <div style="margin-top: 32px; text-align: center;">
                                <a href="mailto:{{ $submission->email }}" style="display: inline-block; background: linear-gradient(135deg, #e8005a 0%, #7b2fbe 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 14px rgba(232,0,90,0.35);">
                                    Reply to {{ $submission->name }}
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0b0b0e; padding: 20px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #52525b;">
                            This is an automated notification from <a href="{{ config('app.url') }}" style="color: #71717a; text-decoration: underline;">{{ config('app.name') }}</a>.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
