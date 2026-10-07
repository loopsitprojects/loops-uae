<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PortfolioItemResource\Pages;
use App\Models\PortfolioItem;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PortfolioItemResource extends Resource
{
    protected static ?string $model = PortfolioItem::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-briefcase';
    protected static ?int $navigationSort = 4;
    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Components\Tabs::make('Case Study')
                ->tabs([
                    Components\Tabs\Tab::make('Content')
                        ->schema([
                            Components\Grid::make(2)->schema([
                                Forms\Components\TextInput::make('client')
                                    ->nullable()
                                    ->maxLength(255)
                                    ->placeholder('e.g. Yamaha'),
                                Forms\Components\TextInput::make('title')
                                    ->nullable()
                                    ->maxLength(255)
                                    ->placeholder('Campaign or project title'),
                            ]),
                            Forms\Components\TextInput::make('slug')
                                ->nullable()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255)
                                ->helperText('Auto-generated from client & title if left blank. Change with care.'),
                            Forms\Components\Textarea::make('brief')
                                ->label('Brief / Challenge')
                                ->rows(3)
                                ->nullable()
                                ->helperText('What was the client\'s challenge?'),
                            Forms\Components\Textarea::make('background')
                                ->label('Background')
                                ->rows(3)
                                ->nullable()
                                ->helperText('Project background or context.'),
                            Forms\Components\Textarea::make('objective')
                                ->label('Objective')
                                ->rows(3)
                                ->nullable()
                                ->helperText('Key goals and campaign objectives.'),
                            Forms\Components\Textarea::make('insight')
                                ->label('Insight')
                                ->rows(3)
                                ->nullable()
                                ->helperText('The key human or market insight discovered.'),
                            Forms\Components\Textarea::make('idea')
                                ->label('The Big Idea')
                                ->rows(3)
                                ->nullable()
                                ->helperText('How the insight was transformed into the campaign idea.'),
                            Forms\Components\Textarea::make('result')
                                ->label('Results')
                                ->rows(3)
                                ->nullable()
                                ->helperText('Measurable outcomes and impact.'),
                        ]),

                    Components\Tabs\Tab::make('Media')
                        ->schema([
                            Components\Grid::make(2)->schema([
                                Components\Group::make([
                                    Forms\Components\SpatieMediaLibraryFileUpload::make('hero')
                                        ->label('Hero Image')
                                        ->collection('hero')
                                        ->disk('works')
                                        ->visibility('public')
                                        ->image()
                                        ->imageEditor()
                                        ->imageEditorAspectRatios([
                                            '16:9',
                                            '16:10',
                                            '4:3',
                                            '1:1',
                                            null,
                                        ])
                                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/x-png', 'image/pjpeg', 'application/x-png', 'application/octet-stream'])
                                        ->imageResizeMode('cover')
                                        ->imageCropAspectRatio('16:9')
                                        ->helperText('Main case study hero image. 💡 Tip: Upload a file above, then hover over the thumbnail and click the Pencil (✏️) icon to open the interactive cropper.')
                                        ->live(),
                                    Forms\Components\TextInput::make('image_url')
                                        ->label('Or: Hero Image URL')
                                        ->url()
                                        ->placeholder('https://...')
                                        ->helperText('Direct image link. Typing or pasting a URL updates the card preview instantly.')
                                        ->live(onBlur: true),
                                    Forms\Components\Select::make('image_fit')
                                        ->label('Image Zoom & Display Mode')
                                        ->options([
                                            'cover' => '🔍 Crop & Fill (Cover - Standard crop to fill card)',
                                            'contain' => '🔍 Zoom Out (Contain - Fit 100% of whole image inside card)',
                                            'contain-pad' => '🔎 Zoom Out Padded (Fit whole image with framed border)',
                                        ])
                                        ->default('cover')
                                        ->nullable()
                                        ->helperText('Zoom Out (Contain) fits 100% of the image inside the card without cropping any edges.')
                                        ->live(),
                                    Forms\Components\Select::make('image_position')
                                        ->label('Card Crop & Framing Alignment')
                                        ->options([
                                            'center' => '🎯 Center Focus (Default)',
                                            'center top' => '⬆️ Top Focus (Show top of image)',
                                            'center 20%' => '↗️ Upper Top Focus (Focus top 20%)',
                                            'center 35%' => '📐 Upper Middle Focus (Focus top 35%)',
                                            'center 65%' => '📐 Lower Middle Focus (Focus bottom 35%)',
                                            'center bottom' => '⬇️ Bottom Focus (Show bottom of image)',
                                            'left center' => '⬅️ Left Focus (Show left side)',
                                            'right center' => '➡️ Right Focus (Show right side)',
                                            'top left' => '↖️ Top Left Focus',
                                            'top right' => '↗️ Top Right Focus',
                                            'bottom left' => '↙️ Bottom Left Focus',
                                            'bottom right' => '↘️ Bottom Right Focus',
                                        ])
                                        ->default('center')
                                        ->nullable()
                                        ->helperText('Select the crop framing position to align subject inside the card.')
                                        ->live(),
                                    Forms\Components\TextInput::make('video_url')
                                        ->label('Hero / Featured Video URL')
                                        ->url()
                                        ->placeholder('https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4 link')
                                        ->helperText('Optional: Overrides hero image with a looping video'),
                                    Forms\Components\Toggle::make('show_hero_as_campaign_video')
                                        ->label('Include Hero Video in Campaign Video Showcase')
                                        ->default(true)
                                        ->helperText('ON: Displays the Hero Video as a playable campaign video in the showcase section. OFF: Excludes Hero Video from the campaign videos section.'),
                                    Forms\Components\Repeater::make('video_urls')
                                        ->label('Campaign Videos (Showcase Multiple Videos)')
                                        ->schema([
                                            Forms\Components\TextInput::make('title')
                                                ->label('Video Title / Label')
                                                ->placeholder('e.g. Main TVC, 30s Cut, Behind the Scenes')
                                                ->maxLength(255),
                                            Forms\Components\TextInput::make('url')
                                                ->label('Video Link (YouTube, Vimeo, or MP4 URL)')
                                                ->placeholder('https://www.youtube.com/watch?v=...')
                                                ->required()
                                                ->url(),
                                            Forms\Components\Select::make('player_type')
                                                ->label('Video Player Type')
                                                ->options([
                                                    'landscape' => 'Landscape Player (16:9)',
                                                    'portrait'  => 'Portrait Player (9:16 / Vertical)',
                                                ])
                                                ->default('landscape')
                                                ->required()
                                                ->helperText('Choose whether to play this video in a Landscape (16:9) or Portrait (9:16 vertical) player.'),
                                        ])
                                        ->itemLabel(fn (array $state): ?string => !empty($state['title']) ? $state['title'] : ($state['url'] ?? 'Video Item'))
                                        ->collapsible()
                                        ->reorderableWithButtons()
                                        ->defaultItems(0)
                                        ->helperText('Add multiple campaign videos. Select Portrait Player for vertical (9:16) videos or Landscape Player for 16:9 videos.'),
                                ]),
                                Components\Group::make([
                                    Forms\Components\Placeholder::make('work_card_applied_preview')
                                        ->label('Applied Work Card Preview (as shown on website)')
                                        ->content(function ($get, $record) {
                                            $client  = $get('client') ?: ($record?->client ?: 'Client Name');
                                            $title   = $get('title') ?: ($record?->title ?: 'Campaign / Project Title');
                                            $year    = $get('year') ?: ($record?->year ?: date('Y'));
                                            $insight = $get('insight') ?: ($record?->insight ?: 'Short project description or key insight text will appear here...');
                                            $result  = $get('result') ?: ($record?->result ?: 'Measurable outcomes and impact achieved...');
                                            $imgPos  = $get('image_position') ?: ($record?->image_position ?: 'center');
                                            $imgFit  = $get('image_fit') ?: ($record?->image_fit ?: 'cover');
                                            
                                            $fitCss = 'object-fit: cover;';
                                            $padCss = '';
                                            if ($imgFit === 'contain') {
                                                $fitCss = 'object-fit: contain;';
                                            } elseif ($imgFit === 'contain-pad') {
                                                $fitCss = 'object-fit: contain;';
                                                $padCss = 'padding: 16px; box-sizing: border-box;';
                                            }

                                            $url = $get('image_url');
                                            $imgUrl = !empty($url) ? \App\Models\PortfolioItem::convertDirectImageUrl($url) : null;

                                            if (empty($imgUrl) && $record) {
                                                try {
                                                    $imgUrl = $record->getFirstMediaUrl('hero');
                                                } catch (\Throwable $e) {}
                                            }
                                            
                                            $heroState = $get('hero');
                                            if (!empty($heroState)) {
                                                if (is_array($heroState)) {
                                                    $firstVal = reset($heroState);
                                                    if ($firstVal instanceof \Livewire\Features\SupportFileUploads\TemporaryUploadedFile) {
                                                        try {
                                                            $imgUrl = $firstVal->temporaryUrl();
                                                        } catch (\Throwable $e) {}
                                                    } elseif (is_string($firstVal) && !empty($firstVal)) {
                                                        $imgUrl = \Illuminate\Support\Facades\Storage::disk('public')->url($firstVal);
                                                    }
                                                }
                                            }

                                            if (empty($imgUrl)) {
                                                $imgUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
                                            }

                                            return new \Illuminate\Support\HtmlString("
                                                <div style='max-width: 360px; font-family: system-ui, -apple-system, sans-serif;'>
                                                    <div style='border-radius: 20px; overflow: hidden; background-color: #0b0b10; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 20px 40px rgba(0,0,0,0.6); text-align: left;'>
                                                        <div style='position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; background-color: #17171c;'>
                                                            <img src='{$imgUrl}' style='width: 100%; height: 100%; {$fitCss} object-position: {$imgPos}; {$padCss}' alt='Work Card Hero Preview' />
                                                            <div style='position: absolute; top: 12px; right: 12px; font-family: monospace; font-size: 11px; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.6); padding: 3px 8px; border-radius: 6px; backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.15); font-weight: bold;'>
                                                                {$year}
                                                            </div>
                                                        </div>
                                                        <div style='padding: 18px; display: flex; flex-direction: column;'>
                                                            <div style='display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;'>
                                                                <span style='color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;'>{$client}</span>
                                                                <span style='color: rgba(255,255,255,0.3); font-size: 11px; font-family: monospace;'>{$year}</span>
                                                            </div>
                                                            <h4 style='color: #ffffff; font-size: 16px; font-weight: 700; line-height: 1.3; margin: 0 0 8px 0;'>{$title}</h4>
                                                            <p style='color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.5; margin: 0 0 14px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;'>{$insight}</p>
                                                            ".(!empty($result) ? "
                                                            <div style='margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: flex-start; gap: 8px;'>
                                                                <span style='color: #34d399; font-weight: bold; font-size: 13px; line-height: 1.2;'>↑</span>
                                                                <span style='color: #e2e8f0; font-size: 12px; line-height: 1.4; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;'>{$result}</span>
                                                            </div>
                                                            " : "")."
                                                        </div>
                                                    </div>
                                                </div>
                                            ");
                                        }),
                                ]),
                            ]),
                            Components\Grid::make(2)->schema([
                                Components\Group::make([
                                    Forms\Components\SpatieMediaLibraryFileUpload::make('gallery')
                                        ->label('Gallery Images')
                                        ->collection('gallery')
                                        ->disk('works')
                                        ->visibility('public')
                                        ->image()
                                        ->imageEditor()
                                        ->imageEditorAspectRatios([
                                            '16:9',
                                            '4:3',
                                            '1:1',
                                            null,
                                        ])
                                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/x-png', 'image/pjpeg', 'application/x-png', 'application/octet-stream'])
                                        ->multiple()
                                        ->reorderable()
                                        ->helperText('Upload campaign imagery in display order (Interactive image cropper enabled for each photo)'),
                                ]),
                                Components\Group::make([
                                    Forms\Components\Repeater::make('gallery_urls')
                                        ->label('Or: Campaign Gallery Image URLs')
                                        ->schema([
                                            Forms\Components\TextInput::make('url')
                                                ->label('Image URL')
                                                ->placeholder('https://domain.com/photo.jpg')
                                                ->required()
                                                ->url(),
                                            Forms\Components\TextInput::make('alt')
                                                ->label('Caption / Alt Text')
                                                ->placeholder('Optional image caption'),
                                        ])
                                        ->itemLabel(fn (array $state): ?string => !empty($state['alt']) ? $state['alt'] : ($state['url'] ?? 'Image Item'))
                                        ->collapsible()
                                        ->reorderable()
                                        ->defaultItems(0)
                                        ->helperText('Add direct image links for the campaign gallery.'),
                                ]),
                            ]),
                        ]),

                    Components\Tabs\Tab::make('Categorisation')
                        ->schema([
                            Components\Grid::make(3)->schema([
                                Forms\Components\Select::make('year')
                                    ->options(array_combine(
                                        range(date('Y'), 2015),
                                        range(date('Y'), 2015)
                                    ))
                                    ->default(date('Y'))
                                    ->nullable(),
                                Forms\Components\Toggle::make('show_year')
                                    ->label('Show Year')
                                    ->default(false)
                                    ->helperText('Display year on public work cards and case study'),
                                Forms\Components\ColorPicker::make('color')
                                    ->label('Accent Color')
                                    ->default('#E8005A')
                                    ->nullable()
                                    ->helperText('Brand / accent color for this case study'),
                            ]),
                            Forms\Components\Select::make('categories')
                                ->label('Categories')
                                ->multiple()
                                ->relationship('categories', 'name')
                                ->preload()
                                ->searchable(),
                            Forms\Components\Select::make('tags')
                                ->label('Tags')
                                ->multiple()
                                ->relationship('tags', 'name')
                                ->preload()
                                ->searchable()
                                ->createOptionForm([
                                    Forms\Components\TextInput::make('name')->required(),
                                ]),
                            Components\Grid::make(4)->schema([
                                Forms\Components\Toggle::make('featured')
                                    ->label('Featured on Homepage')
                                    ->helperText('Show in the Featured Work section'),
                                Forms\Components\Toggle::make('published')
                                    ->label('Published')
                                    ->helperText('Visible on the public site'),
                                Forms\Components\Toggle::make('is_clickable')
                                    ->label('Clickable Detail Page')
                                    ->default(true)
                                    ->helperText('Allow clicking to detail page & show in Next Project'),
                                Forms\Components\Toggle::make('show_gallery')
                                    ->label('Show Campaign Gallery')
                                    ->default(true)
                                    ->helperText('Display gallery section on case study page'),
                                Forms\Components\TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0)
                                    ->label('Sort Order'),
                            ]),
                        ]),

                    Components\Tabs\Tab::make('SEO')
                        ->schema([
                            Forms\Components\TextInput::make('meta_title')
                                ->label('SEO Title')
                                ->maxLength(70)
                                ->helperText('Leave blank to use "[Client] — [Title] | Loops Integrated"'),
                            Forms\Components\Textarea::make('meta_description')
                                ->label('Meta Description')
                                ->rows(2)
                                ->maxLength(160)
                                ->helperText('150–160 characters ideal for search results'),
                            Forms\Components\TextInput::make('canonical_url')
                                ->label('Canonical URL')
                                ->url()
                                ->helperText('Leave blank to use the default page URL'),
                            Forms\Components\Textarea::make('json_ld')
                                ->label('JSON-LD Schema')
                                ->rows(5)
                                ->helperText('Custom JSON-LD markup (optional — auto-generated if blank)'),
                        ]),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('hero_url')
                    ->width(80)->height(50)->label(''),
                Tables\Columns\TextColumn::make('client')
                    ->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()->limit(40),
                Tables\Columns\TextColumn::make('categories.name')
                    ->badge()->separator(','),
                Tables\Columns\TextColumn::make('year')
                    ->sortable(),
                Tables\Columns\IconColumn::make('featured')
                    ->boolean()->sortable(),
                Tables\Columns\ToggleColumn::make('published')
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_clickable')
                    ->label('Clickable')
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('show_gallery')
                    ->label('Gallery')
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable()->label('Order'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('categories')
                    ->relationship('categories', 'name')
                    ->multiple()->preload(),
                Tables\Filters\TernaryFilter::make('featured'),
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
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPortfolioItems::route('/'),
            'create' => Pages\CreatePortfolioItem::route('/create'),
            'edit'   => Pages\EditPortfolioItem::route('/{record}/edit'),
        ];
    }
}
