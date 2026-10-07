<?php

namespace App\Filament\Pages\Auth;

use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Auth\Http\Responses\Contracts\LoginResponse;
use Filament\Models\Contracts\FilamentUser;
use Filament\Notifications\Notification;
use Filament\Auth\Pages\Login as BaseLogin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\HtmlString;
use Illuminate\Validation\ValidationException;

class Login extends BaseLogin
{
    public bool $requiresOtp = false;

    public function mount(): void
    {
        if (Filament::auth()->check()) {
            redirect()->to(route('filament.admin.pages.dashboard'));
            return;
        }

        $intended = session()->get('url.intended');
        if ($intended && (str_contains($intended, '/admin') || str_contains($intended, 'login'))) {
            session()->forget('url.intended');
        }

        if (session()->has('admin_otp_user_id') && session()->get('admin_otp_expires_at') > time()) {
            $this->requiresOtp = true;
        }

        $this->form->fill();
    }

    public function form(Schema $form): Schema
    {
        if ($this->requiresOtp) {
            $recipient = $this->getOtpRecipientEmail();
            return $form
                ->schema([
                    Placeholder::make('otp_info')
                        ->label('')
                        ->content(new HtmlString('
                            <div style="padding: 14px; margin-bottom: 12px; border-radius: 12px; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #b45309; font-size: 0.875rem; line-height: 1.4;">
                                <div style="font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                                    🔒 Two-Factor Security Code Required
                                </div>
                                An OTP verification code has been sent to <strong>' . e($recipient) . '</strong>. Please enter the 6-digit code below to log in.
                            </div>
                        ')),
                    TextInput::make('otp_code')
                        ->label('6-Digit OTP Code')
                        ->placeholder('e.g. 123456')
                        ->required()
                        ->numeric()
                        ->length(6)
                        ->autofocus()
                        ->extraInputAttributes(['tabindex' => 1, 'style' => 'font-size: 1.25rem; letter-spacing: 0.3em; text-align: center; font-weight: bold;']),
                ])
                ->statePath('data');
        }

        return parent::form($form);
    }

    public function authenticate(): ?LoginResponse
    {
        try {
            $this->rateLimit(5);
        } catch (TooManyRequestsException $exception) {
            $this->getRateLimitedNotification($exception)?->send();

            return null;
        }

        $data = $this->form->getState();

        if ($this->requiresOtp) {
            return $this->verifyOtpAndLogin($data);
        }

        return $this->processInitialCredentials($data);
    }

    protected function processInitialCredentials(array $data): ?LoginResponse
    {
        $credentials = $this->getCredentialsFromFormData($data);

        $provider = Filament::auth()->getProvider();
        $user = $provider ? $provider->retrieveByCredentials($credentials) : null;

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            $this->logLoginAttempt('failed_password', $user?->id, $credentials['email'] ?? null);
            $this->throwFailureValidationException();
        }

        if (
            ($user instanceof FilamentUser) &&
            (!$user->canAccessPanel(Filament::getCurrentPanel()))
        ) {
            $this->logLoginAttempt('failed_unauthorized', $user?->id, $user?->email);
            $this->throwFailureValidationException();
        }

        $otp = sprintf('%06d', random_int(100000, 999999));

        session([
            'admin_otp_user_id'    => $user->id,
            'admin_otp_code'       => (string) $otp,
            'admin_otp_expires_at' => time() + 600, // 10 minutes
            'admin_otp_remember'   => $data['remember'] ?? false,
        ]);

        $this->sendOtpEmail($otp);

        $this->requiresOtp = true;
        $this->resetFormSchemas();
        $this->form->fill();

        Notification::make()
            ->title('OTP Code Sent')
            ->body("A 6-digit OTP verification code has been sent to {$this->getOtpRecipientEmail()}.")
            ->success()
            ->send();

        return null;
    }

    protected function getForms(): array
    {
        if ($this->requiresOtp) {
            $recipient = $this->getOtpRecipientEmail();
            return [
                'form' => $this->makeForm()
                    ->schema([
                        Placeholder::make('otp_info')
                            ->label('')
                            ->content(new HtmlString('
                                <div class="p-4 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm leading-relaxed">
                                    <div class="flex items-center gap-2 font-bold mb-1 text-amber-700 dark:text-amber-300" style="font-weight: 700; margin-bottom: 4px;">
                                        🔒 Two-Factor Security Code Required
                                    </div>
                                    An OTP verification code has been sent to <strong class="text-amber-900 dark:text-amber-100" style="color: #f59e0b; font-weight: 600;">' . e($recipient) . '</strong>. Please enter the 6-digit code below to log in.
                                </div>
                            ')),
                        TextInput::make('otp_code')
                            ->label('6-Digit OTP Code')
                            ->placeholder('e.g. 123456')
                            ->required()
                            ->numeric()
                            ->length(6)
                            ->autofocus()
                            ->extraInputAttributes(['tabindex' => 1, 'style' => 'font-size: 1.25rem; letter-spacing: 0.3em; text-align: center; font-weight: bold;']),
                    ])
                    ->statePath('data'),
            ];
        }

        return parent::getForms();
    }

    protected function verifyOtpAndLogin(array $data): ?LoginResponse
    {
        $sessionUserId = session('admin_otp_user_id');
        $sessionOtp = session('admin_otp_code');
        $expiresAt = session('admin_otp_expires_at');
        $remember = session('admin_otp_remember', false);

        if (!$sessionUserId || !$sessionOtp || !$expiresAt) {
            $this->requiresOtp = false;
            $this->resetFormSchemas();
            $this->form->fill();
            throw ValidationException::withMessages([
                'data.otp_code' => 'Session expired. Please enter your credentials again.',
            ]);
        }

        $user = \App\Models\User::find($sessionUserId);

        if (time() > $expiresAt) {
            $this->logLoginAttempt('failed_otp_expired', $user?->id, $user?->email);
            throw ValidationException::withMessages([
                'data.otp_code' => 'The OTP code has expired. Click "Resend OTP" to get a new code.',
            ]);
        }

        $inputOtp = trim((string) ($data['otp_code'] ?? ''));

        if ($inputOtp !== (string) $sessionOtp) {
            $this->logLoginAttempt('failed_otp_invalid', $user?->id, $user?->email);
            throw ValidationException::withMessages([
                'data.otp_code' => 'Invalid OTP code. Please check your email and try again.',
            ]);
        }

        // Log successful login
        $this->logLoginAttempt('successful', $user?->id, $user?->email);

        session()->forget(['admin_otp_user_id', 'admin_otp_code', 'admin_otp_expires_at', 'admin_otp_remember']);

        $intended = session()->get('url.intended');
        if ($intended && (str_contains($intended, '/admin') || str_contains($intended, 'login'))) {
            session()->forget('url.intended');
        }

        session()->regenerate();
        Filament::auth()->login($user, $remember);
        session()->save();

        $dashboardUrl = route('filament.admin.pages.dashboard');
        $this->redirect($dashboardUrl, navigate: false);

        return new class($dashboardUrl) implements LoginResponse {
            public function __construct(private string $dashboardUrl) {}

            public function toResponse($request)
            {
                return redirect()->to($this->dashboardUrl);
            }
        };
    }

    protected function logLoginAttempt(string $status, ?int $userId = null, ?string $email = null): void
    {
        try {
            \App\Models\UserLoginLog::create([
                'user_id'    => $userId,
                'email'      => $email ?: 'unknown',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'status'     => $status,
            ]);
        } catch (\Throwable $e) {
            logger()->error('Failed to save login log', ['error' => $e->getMessage()]);
        }
    }

    protected function resetFormSchemas(): void
    {
        $this->cachedSchemas = [];
    }

    public function resendOtp(): void
    {
        if (!session()->has('admin_otp_user_id')) {
            $this->requiresOtp = false;
            $this->resetFormSchemas();
            $this->form->fill();
            Notification::make()->title('Session Expired')->body('Please log in again.')->danger()->send();
            return;
        }

        $otp = sprintf('%06d', random_int(100000, 999999));

        session([
            'admin_otp_code'       => (string) $otp,
            'admin_otp_expires_at' => time() + 600,
        ]);

        $this->sendOtpEmail($otp);

        Notification::make()
            ->title('New OTP Sent')
            ->body("A new OTP verification code has been sent to {$this->getOtpRecipientEmail()}.")
            ->success()
            ->send();
    }

    public function resetLogin(): void
    {
        session()->forget(['admin_otp_user_id', 'admin_otp_code', 'admin_otp_expires_at', 'admin_otp_remember']);
        $this->requiresOtp = false;
        $this->resetFormSchemas();
        $this->form->fill();
    }

    protected function getOtpRecipientEmail(): string
    {
        if (session()->has('admin_otp_user_id')) {
            $user = \App\Models\User::find(session('admin_otp_user_id'));
            if ($user && $user->email) {
                return $user->email;
            }
        }

        return '';
    }

    protected function sendOtpEmail(string $otp): void
    {
        $recipient = $this->getOtpRecipientEmail();
        if (!$recipient) {
            logger()->error('Cannot send OTP email: Recipient email is empty');
            return;
        }

        try {
            Mail::raw(
                "Your Loops Admin Panel Login OTP verification code is: {$otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.",
                function ($message) use ($recipient) {
                    $message->to($recipient)
                            ->subject('Loops Admin Panel - Login OTP Verification Code');
                }
            );
        } catch (\Throwable $e) {
            logger()->error('Failed to send admin login OTP email', ['error' => $e->getMessage()]);
        }
    }

    protected function getAuthenticateFormAction(): Action
    {
        if ($this->requiresOtp) {
            return Action::make('authenticate')
                ->label('Verify OTP & Log In')
                ->submit('authenticate');
        }

        return parent::getAuthenticateFormAction()
            ->label('Send OTP & Continue');
    }

    protected function getFormActions(): array
    {
        if ($this->requiresOtp) {
            return [
                $this->getAuthenticateFormAction(),
                Action::make('resendOtp')
                    ->label('Resend OTP Email')
                    ->color('gray')
                    ->action('resendOtp'),
                Action::make('resetLogin')
                    ->label('Back to Login')
                    ->color('danger')
                    ->action('resetLogin'),
            ];
        }

        return parent::getFormActions();
    }
}
