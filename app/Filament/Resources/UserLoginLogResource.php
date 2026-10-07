<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserLoginLogResource\Pages;
use App\Models\UserLoginLog;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserLoginLogResource extends Resource
{
    protected static ?string $model = UserLoginLog::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-shield-check';
    protected static string | \UnitEnum | null $navigationGroup = 'Security';
    protected static ?string $navigationLabel = 'Login Logs';
    protected static ?int $navigationSort = 99;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Login Log Details')
                    ->schema([
                        Forms\Components\TextInput::make('email')
                            ->label('Email Address')
                            ->disabled(),
                        Forms\Components\TextInput::make('ip_address')
                            ->label('IP Address')
                            ->disabled(),
                        Forms\Components\TextInput::make('status')
                            ->label('Status')
                            ->disabled(),
                        Forms\Components\Textarea::make('user_agent')
                            ->label('User Agent / Browser')
                            ->rows(3)
                            ->disabled(),
                        Forms\Components\DateTimePicker::make('created_at')
                            ->label('Login Date & Time')
                            ->disabled(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->default(fn ($record) => $record->email)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP Address')
                    ->searchable()
                    ->copyable()
                    ->sortable()
                    ->fontFamily('mono'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'successful' => 'success',
                        'failed_password' => 'danger',
                        'failed_otp_invalid', 'failed_otp_expired' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'successful' => 'Successful',
                        'failed_password' => 'Wrong Password',
                        'failed_otp_invalid' => 'Invalid OTP',
                        'failed_otp_expired' => 'Expired OTP',
                        default => ucfirst($state),
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('user_agent')
                    ->label('Browser / Device')
                    ->limit(50)
                    ->tooltip(fn ($record) => $record->user_agent)
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Login Date & Time')
                    ->dateTime('M j, Y H:i:s')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'successful' => 'Successful',
                        'failed_password' => 'Wrong Password',
                        'failed_otp_invalid' => 'Invalid OTP',
                        'failed_otp_expired' => 'Expired OTP',
                    ]),
            ])
            ->actions([
                Actions\ViewAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserLoginLogs::route('/'),
        ];
    }
}
