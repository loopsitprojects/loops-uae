<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SitePageResource\Pages;
use App\Models\SitePage;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SitePageResource extends Resource
{
    protected static ?string $model = SitePage::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-bars-3-bottom-left';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'Pages & Navigation';
    protected static ?string $modelLabel = 'Page / Nav Item';
    protected static ?string $pluralModelLabel = 'Pages & Navigation';
    protected static ?string $slug = 'pages-navigation';

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Components\Section::make('Page & Link Details')->schema([
                Components\Grid::make(3)->schema([
                    Forms\Components\TextInput::make('label')
                        ->label('Page / Nav Label')
                        ->required()
                        ->maxLength(100)
                        ->placeholder('e.g. Work, About, Creative'),
                    Forms\Components\TextInput::make('key')
                        ->label('Unique Identifier Key')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(50)
                        ->placeholder('e.g. work, about, creative'),
                    Forms\Components\TextInput::make('url')
                        ->label('URL / Route Path')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('e.g. /work, /about, /creative'),
                ]),
                Components\Grid::make(3)->schema([
                    Forms\Components\Select::make('nav_group')
                        ->label('Navigation Placement')
                        ->options([
                            'top'        => 'Top Level Link (Header)',
                            'integrated' => 'Integrated Services (Dropdown)',
                            'cta'        => 'Action Button (Right CTA)',
                            'hidden'     => 'Not in Nav Bar (Standalone Page)',
                        ])
                        ->default('top')
                        ->required(),
                    Forms\Components\TextInput::make('sort_order')
                        ->label('Nav Sort Order')
                        ->numeric()
                        ->default(0)
                        ->helperText('Lower numbers appear first'),
                    Forms\Components\TextInput::make('icon')
                        ->label('Dropdown Icon / Symbol')
                        ->placeholder('e.g. ✦, ◎, ⬡')
                        ->maxLength(50),
                ]),
                Forms\Components\Textarea::make('description')
                    ->label('Sub-label / Description')
                    ->placeholder('e.g. Brand identity & campaigns')
                    ->rows(2)
                    ->maxLength(255)
                    ->columnSpanFull(),
            ]),

            Components\Section::make('Publication Status')->schema([
                Components\Grid::make(2)->schema([
                    Forms\Components\Toggle::make('is_published')
                        ->label('Page Published')
                        ->helperText('When unpublished, the page is unavailable on the public website.')
                        ->default(true),
                    Forms\Components\Toggle::make('show_in_nav')
                        ->label('Publish in Nav Bar')
                        ->helperText('When unpublished, this link is hidden from desktop and mobile navigation menus.')
                        ->default(true),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label')
                    ->label('Page / Nav Label')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('url')
                    ->label('Path')
                    ->searchable()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('nav_group')
                    ->label('Nav Placement')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'top'        => 'Top Bar',
                        'integrated' => 'Integrated Dropdown',
                        'cta'        => 'Action Button',
                        'hidden'     => 'Hidden / Standalone',
                        default      => ucfirst($state),
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'top'        => 'info',
                        'integrated' => 'warning',
                        'cta'        => 'success',
                        default      => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_published')
                    ->label('Page Published')
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('show_in_nav')
                    ->label('Nav Bar Published')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Page Published'),
                Tables\Filters\TernaryFilter::make('show_in_nav')
                    ->label('Nav Bar Published'),
                Tables\Filters\SelectFilter::make('nav_group')
                    ->label('Placement')
                    ->options([
                        'top'        => 'Top Bar',
                        'integrated' => 'Integrated Dropdown',
                        'cta'        => 'Action Button',
                        'hidden'     => 'Hidden',
                    ]),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('publish_pages')
                        ->label('Publish Selected Pages')
                        ->icon('heroicon-o-check')
                        ->action(fn ($records) => $records->each->update(['is_published' => true])),
                    Actions\BulkAction::make('unpublish_pages')
                        ->label('Unpublish Selected Pages')
                        ->icon('heroicon-o-x-mark')
                        ->color('danger')
                        ->action(fn ($records) => $records->each->update(['is_published' => false])),
                    Actions\BulkAction::make('publish_to_nav')
                        ->label('Publish to Nav Bar')
                        ->icon('heroicon-o-eye')
                        ->action(fn ($records) => $records->each->update(['show_in_nav' => true])),
                    Actions\BulkAction::make('unpublish_from_nav')
                        ->label('Unpublish from Nav Bar')
                        ->icon('heroicon-o-eye-slash')
                        ->color('warning')
                        ->action(fn ($records) => $records->each->update(['show_in_nav' => false])),
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListSitePages::route('/'),
            'create' => Pages\CreateSitePage::route('/create'),
            'edit'   => Pages\EditSitePage::route('/{record}/edit'),
        ];
    }
}
