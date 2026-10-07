<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobDepartmentResource\Pages;
use App\Models\JobDepartment;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class JobDepartmentResource extends Resource
{
    protected static ?string $model = JobDepartment::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-building-office-2';
    protected static string | \UnitEnum | null $navigationGroup = 'Careers';
    protected static ?int $navigationSort = 3;
    protected static ?string $navigationLabel = 'Departments';

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Department Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->reactive()
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Display Order')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
            'index'  => Pages\ListJobDepartments::route('/'),
            'create' => Pages\CreateJobDepartment::route('/create'),
            'edit'   => Pages\EditJobDepartment::route('/{record}/edit'),
        ];
    }
}
