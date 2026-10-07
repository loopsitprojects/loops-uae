<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OfficeResource\Pages;
use App\Models\Office;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OfficeResource extends Resource
{
    protected static ?string $model = Office::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-building-office-2';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 6;
    protected static ?string $navigationLabel = 'Offices';
    protected static ?string $modelLabel = 'Office';
    protected static ?string $pluralModelLabel = 'Offices';

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Office Information')->schema([
                    Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('city')
                            ->nullable()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('country')
                            ->nullable()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('role')
                            ->placeholder('e.g. Regional Office / Headquarters')
                            ->nullable()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->nullable()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->nullable()
                            ->maxLength(50),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ]),
                    Forms\Components\Textarea::make('description')
                        ->maxLength(500)
                        ->columnSpanFull(),
                    Forms\Components\Textarea::make('address')
                        ->rows(3)
                        ->columnSpanFull(),
                ]),

                Components\Section::make('Coordinates & Settings')->schema([
                    Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('lat')
                            ->label('Latitude')
                            ->numeric(),
                        Forms\Components\TextInput::make('lng')
                            ->label('Longitude')
                            ->numeric(),
                    ]),
                    Components\Grid::make(3)->schema([
                        Forms\Components\Toggle::make('is_headquarters')
                            ->label('Is Headquarters?')
                            ->default(false),
                        Forms\Components\Toggle::make('show_in_footer')
                            ->label('Show in Footer')
                            ->default(true),
                        Forms\Components\Toggle::make('published')
                            ->label('Published')
                            ->default(true),
                    ]),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('city')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('country')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('role')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_headquarters')
                    ->label('HQ')
                    ->boolean(),
                Tables\Columns\IconColumn::make('show_in_footer')
                    ->label('Footer')
                    ->boolean(),
                Tables\Columns\IconColumn::make('published')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                Tables\Filters\TernaryFilter::make('published'),
                Tables\Filters\TernaryFilter::make('is_headquarters'),
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
            'index'  => Pages\ListOffices::route('/'),
            'create' => Pages\CreateOffice::route('/create'),
            'edit'   => Pages\EditOffice::route('/{record}/edit'),
        ];
    }
}
