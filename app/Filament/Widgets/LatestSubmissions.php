<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestSubmissions extends BaseWidget
{
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Recent Enquiries Received';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ContactSubmission::query()->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('email')
                    ->copyable(),
                Tables\Columns\TextColumn::make('company')
                    ->placeholder('N/A'),
                Tables\Columns\TextColumn::make('service')
                    ->badge()
                    ->color('primary'),
                Tables\Columns\IconColumn::make('is_read')
                    ->label('Read Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-envelope-open')
                    ->falseIcon('heroicon-o-envelope')
                    ->trueColor('gray')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received At')
                    ->dateTime()
                    ->since(),
            ]);
    }
}
