<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-cpu-chip';

    protected static ?int $navigationSort = 6;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Tabs::make('Product details')
                    ->tabs([
                        Components\Tabs\Tab::make('General Info')
                            ->schema([
                                Components\Grid::make(2)->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->required()
                                        ->maxLength(150)
                                        ->columnSpan(2),
                                    Forms\Components\Textarea::make('description')
                                        ->required()
                                        ->rows(5)
                                        ->columnSpan(2),
                                    Forms\Components\TextInput::make('cta_label')
                                        ->maxLength(100)
                                        ->default('Learn More'),
                                    Forms\Components\TextInput::make('cta_link')
                                        ->maxLength(255)
                                        ->default('/contact'),
                                    Forms\Components\TextInput::make('sort_order')
                                        ->required()
                                        ->numeric()
                                        ->default(0),
                                    Forms\Components\Toggle::make('published')
                                        ->required()
                                        ->default(true),
                                ]),
                            ]),
                        Components\Tabs\Tab::make('Card Image')
                            ->schema([
                                Forms\Components\TextInput::make('image_url')
                                    ->label('Image URL / Link')
                                    ->placeholder('https://images.unsplash.com/... or /images/tech-works/sample.png')
                                    ->maxLength(1000)
                                    ->helperText('Paste an image URL / web link here.'),
                                Forms\Components\SpatieMediaLibraryFileUpload::make('image')
                                    ->label('Or Upload Image File')
                                    ->collection('image')
                                    ->image()
                                    ->imagePreviewHeight('200')
                                    ->helperText('Or drag & drop / browse an image file to upload directly.')
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('cta_label')
                    ->searchable(),
                Tables\Columns\TextColumn::make('cta_link')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('published')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Actions\EditAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
