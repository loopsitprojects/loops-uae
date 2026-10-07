<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PressReleaseResource\Pages;
use App\Models\PressRelease;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Illuminate\Support\Str;

class PressReleaseResource extends Resource
{
    protected static ?string $model = PressRelease::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-newspaper';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 4;
    protected static ?string $modelLabel = 'Press & Achievement';
    protected static ?string $pluralModelLabel = 'Press & Achievements';
    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Tabs::make('Press Release Details')
                    ->tabs([
                        Components\Tabs\Tab::make('General Info')
                            ->schema([
                                Components\Grid::make(2)->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->label('Headline / Title')
                                        ->required()
                                        ->maxLength(255)
                                        ->reactive()
                                        ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)))
                                        ->columnSpan(2),

                                    Forms\Components\TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(ignoreRecord: true)
                                        ->columnSpan(1),

                                    Forms\Components\Select::make('category')
                                        ->required()
                                        ->options([
                                            'Achievement'    => 'Achievement',
                                            'Award Win'      => 'Award Win',
                                            'Press Release'  => 'Press Release',
                                            'Media Coverage' => 'Media Coverage',
                                            'Milestone'      => 'Milestone',
                                            'Partnership'    => 'Partnership',
                                        ])
                                        ->default('Achievement')
                                        ->columnSpan(1),

                                    Forms\Components\DatePicker::make('published_date')
                                        ->label('Release / Achievement Date')
                                        ->default(now())
                                        ->columnSpan(1),

                                    Forms\Components\TextInput::make('publisher')
                                        ->label('Publisher / Media Source')
                                        ->placeholder('e.g. Daily FT, Campaign Asia, Loops Newsroom')
                                        ->maxLength(255)
                                        ->default('Loops Integrated')
                                        ->columnSpan(1),

                                    Forms\Components\TextInput::make('external_link')
                                        ->label('External Article Link (Optional)')
                                        ->placeholder('https://www.ft.lk/news-item')
                                        ->url()
                                        ->maxLength(1000)
                                        ->columnSpan(2),

                                    Forms\Components\Textarea::make('excerpt')
                                        ->label('Summary / Teaser')
                                        ->placeholder('A short 1-2 sentence overview shown in preview cards')
                                        ->rows(3)
                                        ->maxLength(500)
                                        ->columnSpan(2),

                                    Forms\Components\Toggle::make('is_featured')
                                        ->label('Highlight as Featured Story')
                                        ->default(false),

                                    Forms\Components\Toggle::make('published')
                                        ->label('Published on Website')
                                        ->default(true),

                                    Forms\Components\TextInput::make('sort_order')
                                        ->numeric()
                                        ->default(0)
                                        ->helperText('Lower numbers appear first among unfeatured items.'),
                                ]),
                            ]),

                        Components\Tabs\Tab::make('Article Content')
                            ->schema([
                                Forms\Components\Textarea::make('content')
                                    ->label('Full Story / Press Release Body')
                                    ->placeholder('Detailed narrative of the achievement, quotes, campaign statistics, and milestones...')
                                    ->rows(12)
                                    ->columnSpanFull(),
                            ]),

                        Components\Tabs\Tab::make('Media, Images & Video')
                            ->schema([
                                Forms\Components\TextInput::make('image_url')
                                    ->label('Featured Cover Image URL')
                                    ->placeholder('https://images.unsplash.com/... or /images/press/sample.jpg')
                                    ->maxLength(1000)
                                    ->helperText('Web link to hero/cover image.'),

                                SpatieMediaLibraryFileUpload::make('image')
                                    ->label('Or Upload Cover Image File')
                                    ->collection('image')
                                    ->image()
                                    ->imagePreviewHeight('200')
                                    ->helperText('Upload a cover photo for this news item.')
                                    ->columnSpanFull(),

                                Forms\Components\TextInput::make('video_url')
                                    ->label('Video URL (YouTube, Vimeo, or MP4)')
                                    ->placeholder('https://www.youtube.com/watch?v=... or https://vimeo.com/... or https://.../video.mp4')
                                    ->url()
                                    ->maxLength(1000)
                                    ->helperText('Optional: Add a video link to be embedded on the story page.')
                                    ->columnSpanFull(),

                                Components\Section::make('Photo Gallery')
                                    ->description('Add multiple photos for this achievement/story gallery.')
                                    ->schema([
                                        SpatieMediaLibraryFileUpload::make('gallery')
                                            ->label('Upload Gallery Photos')
                                            ->collection('gallery')
                                            ->multiple()
                                            ->image()
                                            ->reorderable()
                                            ->columnSpanFull(),

                                        Forms\Components\Repeater::make('gallery_urls')
                                            ->label('Or: Image URLs Gallery')
                                            ->schema([
                                                Forms\Components\TextInput::make('url')
                                                    ->label('Image URL')
                                                    ->placeholder('/images/press/photo.jpg or https://...')
                                                    ->required(),
                                                Forms\Components\TextInput::make('caption')
                                                    ->label('Caption (Optional)'),
                                            ])
                                            ->columns(2)
                                            ->columnSpanFull()
                                            ->collapsible(),
                                    ])
                                    ->collapsible()
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
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->state(function ($record) {
                        $url = $record->image_url;
                        if (!$url) {
                            return null;
                        }
                        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                            return $url;
                        }
                        return asset(ltrim($url, '/'));
                    })
                    ->square()
                    ->size(48),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->wrap()
                    ->limit(50),

                Tables\Columns\BadgeColumn::make('category')
                    ->colors([
                        'primary'   => 'Achievement',
                        'success'   => 'Award Win',
                        'warning'   => 'Press Release',
                        'info'      => 'Media Coverage',
                        'secondary' => 'Milestone',
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('publisher')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('published_date')
                    ->date('M d, Y')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('video_url')
                    ->label('Video')
                    ->icon(fn ($state) => !empty($state) ? 'heroicon-o-video-camera' : null)
                    ->color('warning')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\IconColumn::make('published')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('published_date', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'Achievement'    => 'Achievement',
                        'Award Win'      => 'Award Win',
                        'Press Release'  => 'Press Release',
                        'Media Coverage' => 'Media Coverage',
                        'Milestone'      => 'Milestone',
                    ]),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured Only'),
                Tables\Filters\TernaryFilter::make('published'),
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPressReleases::route('/'),
            'create' => Pages\CreatePressRelease::route('/create'),
            'edit'   => Pages\EditPressRelease::route('/{record}/edit'),
        ];
    }
}
