<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactSubmissionResource\Pages;
use App\Models\ContactSubmission;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactSubmissionResource extends Resource
{
    protected static ?string $model = ContactSubmission::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-envelope';
    protected static string | \UnitEnum | null $navigationGroup = 'CRM';
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationLabel = 'Enquiries';

    public static function getNavigationBadge(): ?string
    {
        return (string) ContactSubmission::whereNull('read_at')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Components\Section::make('Sender')->schema([
                Components\Grid::make(3)->schema([
                    Forms\Components\TextInput::make('name')->disabled(),
                    Forms\Components\TextInput::make('email')->disabled(),
                    Forms\Components\TextInput::make('company')->disabled(),
                ]),
                Components\Grid::make(2)->schema([
                    Forms\Components\TextInput::make('service')->disabled(),
                    Forms\Components\TextInput::make('office_context')->label('Office')->disabled(),
                ]),
            ]),
            Components\Section::make('Message')->schema([
                Forms\Components\Textarea::make('message')->disabled()->rows(6),
            ]),
            Components\Section::make('Meta')->schema([
                Components\Grid::make(2)->schema([
                    Forms\Components\TextInput::make('ip_address')->label('IP Address')->disabled(),
                    Forms\Components\DateTimePicker::make('created_at')->label('Received At')->disabled(),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('company')->searchable()->placeholder('—'),
                Tables\Columns\TextColumn::make('service')->badge()->placeholder('—'),
                Tables\Columns\TextColumn::make('message')->limit(60)->placeholder('—'),
                Tables\Columns\IconColumn::make('is_read')
                    ->label('Read')
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->is_read),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('read_at')
                    ->label('Read Status')
                    ->nullable()
                    ->trueLabel('Read')
                    ->falseLabel('Unread'),
            ])
            ->actions([
                Actions\ViewAction::make(),
                Actions\Action::make('mark_read')
                    ->label('Mark Read')
                    ->icon('heroicon-o-check')
                    ->action(fn ($record) => $record->markAsRead())
                    ->visible(fn ($record) => !$record->is_read),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('mark_read')
                        ->label('Mark as Read')
                        ->icon('heroicon-o-check')
                        ->action(fn ($records) => $records->each->markAsRead()),
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactSubmissions::route('/'),
            'view'  => Pages\ViewContactSubmission::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return true;
    }

    public static function canDeleteAny(): bool
    {
        return true;
    }
}
