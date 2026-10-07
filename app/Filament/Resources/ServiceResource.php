<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Filament\Resources\ServiceResource\RelationManagers;
use App\Models\Service;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static bool $shouldRegisterNavigation = false;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Tabs::make('Tabs')
                    ->tabs([
                        Components\Tabs\Tab::make('Service Info')
                            ->schema([
                                Components\Grid::make(2)->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->required()
                                        ->maxLength(100)
                                        ->reactive()
                                        ->afterStateUpdated(fn ($state, callable $set) => $set('slug', \Illuminate\Support\Str::slug($state))),
                                    Forms\Components\TextInput::make('slug')
                                        ->required()
                                        ->maxLength(100)
                                        ->unique(ignoreRecord: true),
                                    Forms\Components\TextInput::make('headline')
                                        ->required()
                                        ->maxLength(500)
                                        ->columnSpan(2),
                                    Forms\Components\TextInput::make('subheadline')
                                        ->required()
                                        ->maxLength(500)
                                        ->columnSpan(2),
                                    Forms\Components\Textarea::make('description')
                                        ->nullable()
                                        ->rows(5)
                                        ->columnSpan(2),
                                    Forms\Components\TextInput::make('cta_label')
                                        ->required()
                                        ->maxLength(100)
                                        ->default('View Our Work'),
                                    Forms\Components\TextInput::make('cta_link')
                                        ->required()
                                        ->maxLength(255)
                                        ->default('/work'),
                                    Forms\Components\TextInput::make('accent_color')
                                        ->required()
                                        ->maxLength(7)
                                        ->default('#E8005A'),
                                    Forms\Components\TextInput::make('icon')
                                        ->required()
                                        ->maxLength(10)
                                        ->default('◈'),
                                    Forms\Components\TextInput::make('sort_order')
                                        ->required()
                                        ->numeric()
                                        ->default(0),
                                    Forms\Components\Toggle::make('published')
                                        ->required()
                                        ->default(true),
                                ]),
                            ]),
                        Components\Tabs\Tab::make('Capabilities')
                            ->schema([
                                Forms\Components\Repeater::make('capabilities')
                                    ->relationship('capabilities')
                                    ->schema([
                                        Forms\Components\TextInput::make('label')
                                            ->label('Capability Name')
                                            ->required()
                                            ->maxLength(255),
                                        Forms\Components\TextInput::make('sort_order')
                                            ->label('Display Order')
                                            ->numeric()
                                            ->default(0)
                                            ->required(),
                                    ])
                                    ->orderColumn('sort_order')
                                    ->addActionLabel('Add Capability')
                                    ->grid(2)
                                    ->columnSpanFull(),
                            ]),
                        Components\Tabs\Tab::make('Hero Image')
                            ->schema([
                                Forms\Components\SpatieMediaLibraryFileUpload::make('hero')
                                    ->collection('hero')
                                    ->image()
                                    ->imagePreviewHeight('200')
                                    ->helperText('Upload a hero image for this service page.')
                                    ->columnSpanFull(),
                            ]),
                        Components\Tabs\Tab::make('SEO Settings')
                            ->schema([
                                Forms\Components\TextInput::make('meta_title')
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('meta_description')
                                    ->maxLength(500),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('headline')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subheadline')
                    ->searchable(),
                Tables\Columns\TextColumn::make('cta_label')
                    ->searchable(),
                Tables\Columns\TextColumn::make('cta_link')
                    ->searchable(),
                Tables\Columns\TextColumn::make('accent_color')
                    ->searchable(),
                Tables\Columns\TextColumn::make('icon')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('published')
                    ->boolean(),
                Tables\Columns\TextColumn::make('meta_title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('meta_description')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
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
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
