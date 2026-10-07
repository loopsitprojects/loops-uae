<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageSectionResource\Pages;
use App\Models\PageSection;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PageSectionResource extends Resource
{
    protected static ?string $model = PageSection::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationLabel = 'Page Sections';

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Components\Grid::make(3)->schema([
                Forms\Components\Select::make('page')
                    ->options([
                        'global'  => 'Global / Site-wide',
                        'home'    => 'Home Page',
                        'work'    => 'Work Page',
                        'contact' => 'Contact Page',
                        'creative'   => 'Service: Creative',
                        'digital'    => 'Service: Digital',
                        'play'       => 'Service: Play',
                        'tech'       => 'Service: Tech',
                        'ai-content' => 'Service: AI Content',
                        'events'     => 'Service: Events',
                    ])
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('section')
                    ->required()
                    ->maxLength(100)
                    ->placeholder('e.g. hero, stats, newsletter')
                    ->helperText('Machine-readable key for this section'),
                Forms\Components\Toggle::make('published')
                    ->label('Published')
                    ->default(true),
            ]),
            Components\Section::make('Section Data (JSON)')
                ->description('Edit the structured content for this section. Each key becomes available to the frontend.')
                ->schema([
                    Forms\Components\KeyValue::make('data')
                        ->label('')
                        ->keyLabel('Field')
                        ->valueLabel('Value')
                        ->addActionLabel('Add field')
                        ->columnSpanFull(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('section')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('published')->boolean(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('section')
            ->actions([
                Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPageSections::route('/'),
            'create' => Pages\CreatePageSection::route('/create'),
            'edit'   => Pages\EditPageSection::route('/{record}/edit'),
        ];
    }
}
