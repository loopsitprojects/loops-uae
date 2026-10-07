<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-newspaper';
    protected static string | \UnitEnum | null $navigationGroup = 'CRM';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'Newsletter Subscribers';
    protected static ?string $modelLabel = 'Subscriber';
    protected static ?string $pluralModelLabel = 'Newsletter Subscribers';

    public static function getNavigationBadge(): ?string
    {
        return (string) NewsletterSubscriber::where('status', 'subscribed')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Components\Section::make('Subscriber Information')->schema([
                Components\Grid::make(2)->schema([
                    Forms\Components\TextInput::make('email')
                        ->email()
                        ->required()
                        ->maxLength(255),
                    Forms\Components\Select::make('status')
                        ->options([
                            'subscribed'   => 'Subscribed',
                            'unsubscribed' => 'Unsubscribed',
                        ])
                        ->default('subscribed')
                        ->required(),
                    Forms\Components\TextInput::make('source')
                        ->label('Signup Source')
                        ->placeholder('e.g. website, footer')
                        ->maxLength(100),
                    Forms\Components\TextInput::make('ip_address')
                        ->label('IP Address')
                        ->maxLength(50),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'subscribed'   => 'success',
                        'unsubscribed' => 'danger',
                        default        => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('source')
                    ->label('Source')
                    ->badge()
                    ->placeholder('website')
                    ->sortable(),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('webhook_status')
                    ->label('Webhook')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'synced'  => 'success',
                        'failed'  => 'danger',
                        default   => 'warning',
                    })
                    ->tooltip(fn ($record) => $record->webhook_response)
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Subscribed At')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'subscribed'   => 'Subscribed',
                        'unsubscribed' => 'Unsubscribed',
                    ]),
                Tables\Filters\SelectFilter::make('webhook_status')
                    ->label('Webhook Status')
                    ->options([
                        'synced'  => 'Synced',
                        'failed'  => 'Failed',
                        'pending' => 'Pending',
                    ]),
            ])
            ->actions([
                Actions\Action::make('send_webhook')
                    ->label('Send Webhook')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('info')
                    ->requiresConfirmation()
                    ->action(function (NewsletterSubscriber $record) {
                        $res = \App\Services\NewsletterWebhookService::send($record, 'subscriber.sync');
                        if (!empty($res['success'])) {
                            \Filament\Notifications\Notification::make()
                                ->title('Webhook Sent Successfully')
                                ->body("Dispatched {$record->email} to newsletter app.")
                                ->success()
                                ->send();
                        } else {
                            \Filament\Notifications\Notification::make()
                                ->title('Webhook Failed')
                                ->body($res['error'] ?? $res['message'] ?? 'Could not dispatch webhook.')
                                ->danger()
                                ->send();
                        }
                    }),
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('bulk_send_webhook')
                        ->label('Sync to Newsletter App')
                        ->icon('heroicon-o-paper-airplane')
                        ->color('primary')
                        ->requiresConfirmation()
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $synced = 0;
                            $failed = 0;
                            foreach ($records as $record) {
                                $res = \App\Services\NewsletterWebhookService::send($record, 'subscriber.sync');
                                if (!empty($res['success'])) {
                                    $synced++;
                                } else {
                                    $failed++;
                                }
                            }
                            \Filament\Notifications\Notification::make()
                                ->title('Bulk Webhook Completed')
                                ->body("Synced: {$synced} | Failed: {$failed}")
                                ->send();
                        }),
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterSubscribers::route('/'),
        ];
    }
}
