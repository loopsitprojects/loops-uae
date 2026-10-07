<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClientResource\Pages;
use App\Models\Client;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ClientResource extends Resource
{
    protected static ?string $model = Client::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-tag';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 3;
    protected static ?string $navigationLabel = 'Brands';
    protected static ?string $modelLabel = 'Brand';
    protected static ?string $pluralModelLabel = 'Brands';
    protected static ?string $slug = 'brands';

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Components\Section::make('Brand Details')->schema([
                Components\Grid::make(2)->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('e.g. Yamaha'),
                    Forms\Components\TextInput::make('url')
                        ->label('Website URL')
                        ->url()
                        ->maxLength(500)
                        ->placeholder('https://yamaha-motor.com'),
                ]),
                Components\Grid::make(3)->schema([
                    Forms\Components\TextInput::make('sort_order')
                        ->label('Display Order')
                        ->numeric()
                        ->default(0)
                        ->helperText('Lower = appears earlier in the marquee'),
                    Forms\Components\Toggle::make('published')
                        ->label('Show in marquee')
                        ->default(true)
                        ->inline(false),
                ]),
            ]),

            Components\Section::make('Logo')
                ->description('Upload the brand\'s logo. SVG or PNG on transparent background preferred. The logo is displayed on a dark background, so white/light versions work best.')
                ->schema([
                    Forms\Components\SpatieMediaLibraryFileUpload::make('logo')
                        ->label('')
                        ->collection('logo')
                        ->image()
                        ->imagePreviewHeight('80')
                        ->acceptedFileTypes(['image/png', 'image/svg+xml', 'image/webp', 'image/jpeg'])
                        ->maxSize(512)
                        ->helperText('Max 512 KB. PNG, SVG, or WebP. Recommended: 300×120px.'),
                    Forms\Components\TextInput::make('logo_domain')
                        ->label('Clearbit Fallback Domain')
                        ->placeholder('yamaha-motor.com')
                        ->helperText('Used automatically if no brand logo is uploaded above.')
                        ->maxLength(255),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('logo')
                    ->collection('logo')
                    ->height(36)
                    ->width(80)
                    ->label('Logo')
                    ->defaultImageUrl(fn ($record) => $record->logo_domain
                        ? "https://logo.clearbit.com/{$record->logo_domain}?size=80"
                        : null
                    ),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('logo_domain')
                    ->label('Clearbit Domain')
                    ->searchable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
                Tables\Columns\IconColumn::make('published')
                    ->boolean()
                    ->label('Live'),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
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

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListClients::route('/'),
            'create' => Pages\CreateClient::route('/create'),
            'edit'   => Pages\EditClient::route('/{record}/edit'),
        ];
    }
}
