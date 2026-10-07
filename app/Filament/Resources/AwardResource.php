<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AwardResource\Pages;
use App\Models\Award;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class AwardResource extends Resource
{
    protected static ?string $model = Award::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-trophy';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 3;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Award Details')
                    ->schema([
                        Forms\Components\TextInput::make('award_body')
                            ->label('Award Show / Organization')
                            ->placeholder('e.g. The Four A\'s Advertising Awards, Effie Awards, Gold Dragon Award')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('tier')
                            ->label('Tier / Category Winner')
                            ->placeholder('e.g. Gold, Silver, Bronze, Home Furnishings & Appliances')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('year')
                            ->required()
                            ->numeric()
                            ->default((int) date('Y')),
                        Forms\Components\TextInput::make('category')
                            ->label('Category Name')
                            ->placeholder('e.g. Film & TV, Social (Influencer), Food & Desserts')
                            ->required()
                            ->maxLength(255),
                    ])->columns(2),

                Components\Section::make('Campaign & Client Information')
                    ->schema([
                        Forms\Components\TextInput::make('campaign_name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('client_name')
                            ->label('Client / Agency Collaborators')
                            ->placeholder('e.g. Seylan Bank PLC, AIA Insurance Lanka Limited')
                            ->nullable()
                            ->maxLength(255),
                        Forms\Components\Select::make('portfolio_item_id')
                            ->label('Link to Portfolio Item (Optional)')
                            ->relationship('portfolioItem', 'title')
                            ->searchable()
                            ->nullable(),
                        Forms\Components\Textarea::make('insight')
                            ->label('Award Insight / Description')
                            ->nullable()
                            ->columnSpanFull(),
                    ])->columns(2),

                Components\Section::make('Media & Display Settings')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('background')
                            ->collection('background')
                            ->label('Upload Trophy Image (PNG transparent)'),
                        Forms\Components\TextInput::make('background_path')
                            ->label('Or Custom Trophy Image Path')
                            ->placeholder('/images/awards/four-as-gold-2024-nobg.png'),
                        Forms\Components\Toggle::make('published')
                            ->label('Published on Website')
                            ->default(true)
                            ->required(),
                        Forms\Components\TextInput::make('sort_order')
                            ->required()
                            ->numeric()
                            ->default(0),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('award_body')
                    ->label('Award Show')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('tier')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('campaign_name')
                    ->label('Campaign')
                    ->searchable(),
                Tables\Columns\TextColumn::make('client_name')
                    ->label('Client')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category')
                    ->searchable(),
                Tables\Columns\TextColumn::make('year')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('published')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
            ])
            ->defaultSort('year', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('award_body')
                    ->options(fn () => Award::query()->distinct()->pluck('award_body', 'award_body')->toArray()),
                Tables\Filters\TernaryFilter::make('published'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAwards::route('/'),
            'create' => Pages\CreateAward::route('/create'),
            'edit' => Pages\EditAward::route('/{record}/edit'),
        ];
    }
}
