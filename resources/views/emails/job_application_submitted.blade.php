<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Application</title>
</head>
<body style="margin: 0; padding: 0; background-color: #eef0f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #eef0f2; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 650px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
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
                        <td style="padding: 40px 48px;">
                            
                            <!-- Post Name -->
                            <div style="padding-bottom: 18px; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Post Name</div>
                                <div style="font-size: 15px; color: #374151;">{{ $job->title ?? 'N/A' }}</div>
                            </div>

                            <!-- Full Name -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Full Name</div>
                                <div style="font-size: 15px; color: #374151;">{{ $application->name }}</div>
                            </div>

                            <!-- Email -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Email</div>
                                <div style="font-size: 15px;">
                                    <a href="mailto:{{ $application->email }}" style="color: #e85d04; text-decoration: underline;">{{ $application->email }}</a>
                                </div>
                            </div>

                            <!-- Phone Number -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Phone Number</div>
                                <div style="font-size: 15px; color: #374151;">{{ $application->phone }}</div>
                            </div>

                            <!-- Expected Salary -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Expected Salary</div>
                                <div style="font-size: 15px; color: #374151;">{{ $application->expected_salary }}</div>
                            </div>

                            <!-- Upload Your CV -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Upload Your CV</div>
                                <div style="font-size: 15px;">
                                    @if(!empty($cvUrl))
                                        <a href="{{ $cvUrl }}" target="_blank" style="color: #e85d04; text-decoration: underline;">{{ $cvFilename }}</a>
                                    @else
                                        <span style="color: #9ca3af;">No file uploaded</span>
                                    @endif
                                </div>
                            </div>

                            <!-- Portfolio -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Portfolio</div>
                                <div style="font-size: 15px; word-break: break-all;">
                                    @if(!empty($application->portfolio))
                                        <a href="{{ $application->portfolio }}" target="_blank" style="color: #e85d04; text-decoration: underline;">{{ $application->portfolio }}</a>
                                    @else
                                        <span style="color: #9ca3af;">N/A</span>
                                    @endif
                                </div>
                            </div>

                            <!-- department -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">department</div>
                                <div style="font-size: 15px; color: #374151;">{{ $job->department ?? 'N/A' }}</div>
                            </div>

                            @if(!empty($application->cover_letter))
                            <!-- Cover Letter -->
                            <div style="padding: 18px 0; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Cover Letter</div>
                                <div style="font-size: 15px; color: #374151; white-space: pre-line;">{{ $application->cover_letter }}</div>
                            </div>
                            @endif

                            <!-- Footer note -->
                            <div style="margin-top: 36px; text-align: center; font-size: 13px; color: #9ca3af;">
                                Sent from <a href="{{ config('app.url') }}" style="color: #6b7280; text-decoration: underline;">Loops Integrated</a>
                            </div>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
