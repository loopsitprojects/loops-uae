<?php

namespace App\Filament\Pages;

use App\Models\PageSection;
use App\Models\SitePage;
use Filament\Forms\Components\ColorPicker;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageEvents extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-calendar-days';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 11;
    protected static ?string $navigationLabel = 'Events Page';
    protected ?string $heading = 'Manage Events Page';

    protected string $view = 'filament.pages.manage-events';

    public ?array $data = [];

    public function mount(): void
    {
        $hero = PageSection::where('page', 'events')->where('section', 'hero')->first()?->data ?? [
            'label' => 'LOOPS INTEGRATED — EVENTS & EXPERIENCES',
            'title' => 'Events & Experiences',
            'subtitle' => 'Moments people talk about for years.',
            'description' => 'We design unforgettable physical, hybrid, and virtual experiences that turn audiences into loyal advocates and deliver measurable impact.',
        ];

        $stats = PageSection::where('page', 'events')->where('section', 'stats')->first()?->data ?? [
            'stats' => [
                ['number' => '200+', 'label' => 'Events Produced'],
                ['number' => '15+', 'label' => 'Years Experience'],
                ['number' => '2M+', 'label' => 'Audience Reached'],
                ['number' => '4', 'label' => 'Regional Markets'],
            ]
        ];

        $disciplines = PageSection::where('page', 'events')->where('section', 'disciplines')->first()?->data ?? [
            'disciplines' => [
                [
                    'icon' => '✦',
                    'title' => 'Event Strategy',
                    'description' => 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
                    'stat' => '',
                    'stat_label' => '',
                    'accent_color' => '#E8005A',
                ],
                [
                    'icon' => '◎',
                    'title' => 'Venue & Logistics',
                    'description' => 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
                    'stat' => '',
                    'stat_label' => '',
                    'accent_color' => '#7B2FBE',
                ],
                [
                    'icon' => '⬡',
                    'title' => 'Stage & AV Production',
                    'description' => 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
                    'stat' => '',
                    'stat_label' => '',
                    'accent_color' => '#1B3FB5',
                ],
                [
                    'icon' => '⌬',
                    'title' => 'Guest Experience Design',
                    'description' => 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
                    'stat' => '',
                    'stat_label' => '',
                    'accent_color' => '#00B4B4',
                ],
                [
                    'icon' => '✦',
                    'title' => 'Press & Media Relations',
                    'description' => 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
                    'stat' => '',
                    'stat_label' => '',
                    'accent_color' => '#E8005A',
                ],
                [
                    'icon' => '◎',
                    'title' => 'Post-event Content',
                    'description' => 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
                    'stat' => '',
                    'stat_label' => '',
                    'accent_color' => '#7B2FBE',
                ],
            ]
        ];

        $process = PageSection::where('page', 'events')->where('section', 'process')->first()?->data ?? [
            'process' => [
                ['step' => '01', 'title' => 'Discovery & Briefing', 'desc' => 'We deep-dive into your brand strategy, audience profile, and success metrics before a single prop is ordered.'],
                ['step' => '02', 'title' => 'Concept & Creative', 'desc' => 'Our creative team develops full experience concepts — spatial design, sensory journey, content flow, and brand integration.'],
                ['step' => '03', 'title' => 'Production & Logistics', 'desc' => 'Venue sourcing, vendor management, technical production, and contingency planning handled end-to-end.'],
                ['step' => '04', 'title' => 'Live Execution', 'desc' => 'On-ground Loops team ensures flawless delivery. Real-time problem-solving. Nothing left to chance.'],
                ['step' => '05', 'title' => 'Amplification & Reporting', 'desc' => 'Post-event content, PR push, social amplification, and a full impact report measuring ROI against your brief.'],
            ]
        ];

        $pastEvents = PageSection::where('page', 'events')->where('section', 'past_events')->first()?->data ?? [
            'past_events' => [
                [
                    'client' => 'Softlogic Invest',
                    'campaign' => 'Dance the Way You Want',
                    'type' => 'Experiential Campaign',
                    'year' => '2023',
                    'award' => '2× Gold — The Four A\'s',
                    'bg' => '/images/softlogic-bg.jpg',
                ],
                [
                    'client' => 'Havelock City Mall',
                    'campaign' => 'Bringing My Happy Place to Life',
                    'type' => 'Brand Activation',
                    'year' => '2022',
                    'award' => 'Gold — The Four A\'s',
                    'bg' => '/images/mall-bg.jpg',
                ],
                [
                    'client' => 'Vivya / Hemas',
                    'campaign' => 'Remove Stress Make-Up',
                    'type' => 'Product Launch + Activation',
                    'year' => '2023',
                    'award' => 'Bronze — The Four A\'s',
                    'bg' => '/images/vivya-bg.jpg',
                ],
            ]
        ];

        $gallery = PageSection::where('page', 'events')->where('section', 'gallery')->first()?->data ?? [
            'gallery' => [
                ['title' => 'Maliban OGF Activation', 'category' => 'Maliban OGF', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Maliban/MalibanOGF_01.jpeg', 'caption' => 'Maliban OGF Event Experience'],
                ['title' => 'Maliban OGF Activation', 'category' => 'Maliban OGF', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Maliban/MalibanOGF_02.jpeg', 'caption' => 'Maliban OGF Event Experience'],
                ['title' => 'Maliban OGF Activation', 'category' => 'Maliban OGF', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Maliban/MalibanOGF_03.jpeg', 'caption' => 'Maliban OGF Event Experience'],
                ['title' => 'Maliban OGF Activation', 'category' => 'Maliban OGF', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Maliban/MalibanOGF_04.jpeg', 'caption' => 'Maliban OGF Event Experience'],
                ['title' => 'Maliban OGF Activation', 'category' => 'Maliban OGF', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Maliban/MalibanOGF_05.jpeg', 'caption' => 'Maliban OGF Event Experience'],
                ['title' => 'Lanka Tiles Showcase', 'category' => 'Lanka Tiles', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/LankaTiles/LankaTiles01.jpeg', 'caption' => 'Lanka Tiles Exhibition & Event'],
                ['title' => 'Lanka Tiles Showcase', 'category' => 'Lanka Tiles', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/LankaTiles/LankaTiles02.jpeg', 'caption' => 'Lanka Tiles Exhibition & Event'],
                ['title' => 'Lanka Tiles Showcase', 'category' => 'Lanka Tiles', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/LankaTiles/LankaTiles03.jpeg', 'caption' => 'Lanka Tiles Exhibition & Event'],
                ['title' => 'Lanka Tiles Showcase', 'category' => 'Lanka Tiles', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/LankaTiles/LankaTiles04.jpeg', 'caption' => 'Lanka Tiles Exhibition & Event'],
                ['title' => 'Lanka Tiles Showcase', 'category' => 'Lanka Tiles', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/LankaTiles/LankaTiles05.jpeg', 'caption' => 'Lanka Tiles Exhibition & Event'],
                ['title' => 'Lanka Tiles Showcase', 'category' => 'Lanka Tiles', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/LankaTiles/LankaTiles06.jpeg', 'caption' => 'Lanka Tiles Exhibition & Event'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens01.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens02.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens03.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens04.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens05.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens06.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
                ['title' => 'Seylan Teens Event', 'category' => 'Seylan Teens', 'url' => 'https://ai.loopsintegrated.co/loopsvideos/Events/Seylan/SeylanTeens07.jpeg', 'caption' => 'Seylan Bank Teens Event Campaign'],
            ]
        ];

        $awards = \App\Models\Award::orderBy('sort_order')->orderByDesc('year')->get()->toArray();
        $pageRecord = SitePage::where('key', 'events')->first();

        $this->form->fill([
            'page_settings' => [
                'is_published' => $pageRecord?->is_published ?? true,
                'show_in_nav'  => $pageRecord?->show_in_nav ?? true,
            ],
            'hero' => $hero,
            'stats' => $stats['stats'],
            'disciplines' => $disciplines['disciplines'],
            'process' => $process['process'],
            'past_events' => $pastEvents['past_events'],
            'gallery' => $gallery['gallery'],
            'awards' => $awards,
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Tabs::make('Tabs')
                    ->tabs([
                        Tabs\Tab::make('Hero Section')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('hero.label')
                                        ->label('Hero Label')
                                        ->required()
                                        ->columnSpan(2),
                                    TextInput::make('hero.title')
                                        ->label('Hero Title')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('hero.subtitle')
                                        ->label('Hero Subtitle')
                                        ->required()
                                        ->columnSpan(1),
                                    Textarea::make('hero.description')
                                        ->label('Hero Description')
                                        ->nullable()
                                        ->columnSpan(2)
                                        ->rows(4),
                                ]),
                            ]),
                        Tabs\Tab::make('Stats')
                            ->schema([
                                Repeater::make('stats')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('number')
                                                ->label('Stat Number / Value')
                                                ->required()
                                                ->placeholder('e.g. 200+'),
                                            TextInput::make('label')
                                                ->label('Stat Label')
                                                ->required()
                                                ->placeholder('e.g. Events Produced'),
                                        ]),
                                    ])
                                    ->columns(1)
                                    ->defaultItems(4)
                                    ->addActionLabel('Add Stat'),
                            ]),
                        Tabs\Tab::make('What We Do')
                            ->schema([
                                Repeater::make('disciplines')
                                    ->label('What We Do Cards')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('icon')
                                                ->label('Icon Symbol')
                                                ->nullable()
                                                ->placeholder('e.g. ✦, ◎, ⬡, ⌬')
                                                ->columnSpan(1),
                                            TextInput::make('title')
                                                ->label('Title')
                                                ->required()
                                                ->placeholder('e.g. Event Strategy')
                                                ->columnSpan(1),
                                            ColorPicker::make('accent_color')
                                                ->label('Accent Color')
                                                ->required()
                                                ->default('#E8005A')
                                                ->columnSpan(1),
                                            Textarea::make('description')
                                                ->label('Description')
                                                ->required()
                                                ->placeholder('e.g. Crafting bespoke activations...')
                                                ->columnSpan(3)
                                                ->rows(3),
                                            TextInput::make('stat')
                                                ->label('Stat Value (Optional)')
                                                ->nullable()
                                                ->placeholder('e.g. 80+')
                                                ->columnSpan(1),
                                            TextInput::make('stat_label')
                                                ->label('Stat Label (Optional)')
                                                ->nullable()
                                                ->placeholder('e.g. activations produced')
                                                ->columnSpan(2),
                                        ]),
                                    ])
                                    ->defaultItems(6)
                                    ->addActionLabel('Add What We Do Card'),
                            ]),
                        Tabs\Tab::make('Process Steps')
                            ->schema([
                                Repeater::make('process')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('step')
                                                ->label('Step Number')
                                                ->required()
                                                ->placeholder('e.g. 01')
                                                ->columnSpan(1),
                                            TextInput::make('title')
                                                ->label('Title')
                                                ->required()
                                                ->placeholder('e.g. Discovery & Briefing')
                                                ->columnSpan(2),
                                            Textarea::make('desc')
                                                ->label('Description')
                                                ->required()
                                                ->columnSpan(3)
                                                ->rows(2),
                                        ]),
                                    ])
                                    ->defaultItems(5)
                                    ->addActionLabel('Add Process Step'),
                            ]),
                        Tabs\Tab::make('Past Events')
                            ->schema([
                                Repeater::make('past_events')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('campaign')
                                                ->label('Campaign Name')
                                                ->required()
                                                ->placeholder('e.g. Dance the Way You Want')
                                                ->columnSpan(2),
                                            TextInput::make('client')
                                                ->label('Client Name')
                                                ->required()
                                                ->placeholder('e.g. Softlogic Invest')
                                                ->columnSpan(1),
                                            TextInput::make('type')
                                                ->label('Event Type')
                                                ->required()
                                                ->placeholder('e.g. Experiential Campaign')
                                                ->columnSpan(1),
                                            TextInput::make('year')
                                                ->label('Year')
                                                ->required()
                                                ->placeholder('e.g. 2023')
                                                ->columnSpan(1),
                                            TextInput::make('award')
                                                ->label('Award / Recognition')
                                                ->placeholder('e.g. 2× Gold — The Four A\'s')
                                                ->columnSpan(1),
                                            TextInput::make('bg')
                                                ->label('Background Image Path or URL')
                                                ->required()
                                                ->placeholder('e.g. /images/softlogic-bg.jpg')
                                                ->columnSpan(3),
                                        ]),
                                    ])
                                    ->defaultItems(3)
                                    ->addActionLabel('Add Past Event'),
                            ]),
                        Tabs\Tab::make('Awards')
                            ->schema([
                                Repeater::make('awards')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('id')
                                                ->hidden(),
                                            Select::make('tier')
                                                ->label('Tier')
                                                ->options([
                                                    'Gold' => 'Gold',
                                                    'Silver' => 'Silver',
                                                    'Bronze' => 'Bronze',
                                                ])
                                                ->required()
                                                ->columnSpan(1),
                                            TextInput::make('count')
                                                ->label('Count')
                                                ->numeric()
                                                ->required()
                                                ->default(1)
                                                ->columnSpan(1),
                                            TextInput::make('award_body')
                                                ->label('Award Body')
                                                ->required()
                                                ->placeholder("e.g. The Four A's of Sri Lanka")
                                                ->columnSpan(1),
                                            TextInput::make('year')
                                                ->label('Year')
                                                ->numeric()
                                                ->required()
                                                ->placeholder('e.g. 2023')
                                                ->columnSpan(1),
                                            TextInput::make('campaign_name')
                                                ->label('Campaign Name')
                                                ->required()
                                                ->placeholder('e.g. Dance the Way You Want')
                                                ->columnSpan(2),
                                            TextInput::make('client_name')
                                                ->label('Client Name')
                                                ->required()
                                                ->placeholder('e.g. Softlogic Invest')
                                                ->columnSpan(1),
                                            TextInput::make('category')
                                                ->label('Category')
                                                ->required()
                                                ->placeholder('e.g. Integrated Campaign')
                                                ->columnSpan(1),
                                            Select::make('portfolio_item_id')
                                                ->label('Linked Portfolio Item')
                                                ->options(\App\Models\PortfolioItem::pluck('title', 'id'))
                                                ->searchable()
                                                ->nullable()
                                                ->columnSpan(1),
                                            Textarea::make('insight')
                                                ->label('Insight')
                                                ->nullable()
                                                ->columnSpan(3)
                                                ->rows(3),
                                            FileUpload::make('background_path')
                                                ->label('Background Image')
                                                ->directory('awards')
                                                ->image()
                                                ->columnSpan(2),
                                            FileUpload::make('client_logo_path')
                                                ->label('Client Logo')
                                                ->directory('awards')
                                                ->image()
                                                ->columnSpan(1),
                                            TextInput::make('sort_order')
                                                ->label('Sort Order')
                                                ->numeric()
                                                ->default(0)
                                                ->columnSpan(1),
                                            Toggle::make('published')
                                                ->label('Published')
                                                ->default(true)
                                                ->columnSpan(2),
                                        ]),
                                    ])
                                    ->addActionLabel('Add Award'),
                            ]),
                        Tabs\Tab::make('Events Gallery')
                            ->schema([
                                Repeater::make('gallery')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('title')
                                                ->label('Image Title')
                                                ->required(),
                                            TextInput::make('category')
                                                ->label('Brand / Category')
                                                ->placeholder('e.g. Maliban OGF, Lanka Tiles, Seylan Teens')
                                                ->required(),
                                            TextInput::make('url')
                                                ->label('Image URL')
                                                ->url()
                                                ->required()
                                                ->columnSpan(2),
                                            TextInput::make('caption')
                                                ->label('Caption / Description')
                                                ->columnSpan(2),
                                        ]),
                                    ])
                                    ->columns(1)
                                    ->reorderableWithButtons()
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                    ->addActionLabel('Add Gallery Image'),
                            ]),
                        Tabs\Tab::make('Publication Status')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Grid::make(2)->schema([
                                    Toggle::make('page_settings.is_published')
                                        ->label('Page Published')
                                        ->helperText('When unpublished, the Events page is unavailable on the public website.')
                                        ->default(true),
                                    Toggle::make('page_settings.show_in_nav')
                                        ->label('Publish in Nav Bar')
                                        ->helperText('When enabled, Events & Experiences appears in the navigation bar dropdown.')
                                        ->default(true),
                                ]),
                            ]),
                    ])
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        $isPublished = $state['page_settings']['is_published'] ?? true;
        $showInNav   = $state['page_settings']['show_in_nav'] ?? true;

        SitePage::updateOrCreate(
            ['key' => 'events'],
            [
                'label'        => 'Events & Experiences',
                'url'          => '/events',
                'nav_group'    => 'integrated',
                'is_published' => $isPublished,
                'show_in_nav'  => $showInNav,
            ]
        );

        PageSection::updateOrCreate(
            ['page' => 'events', 'section' => 'hero'],
            ['data' => $state['hero'], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'events', 'section' => 'stats'],
            ['data' => ['stats' => $state['stats']], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'events', 'section' => 'disciplines'],
            ['data' => ['disciplines' => $state['disciplines']], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'events', 'section' => 'process'],
            ['data' => ['process' => $state['process']], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'events', 'section' => 'past_events'],
            ['data' => ['past_events' => $state['past_events']], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'events', 'section' => 'gallery'],
            ['data' => ['gallery' => $state['gallery'] ?? []], 'published' => $isPublished]
        );

        // Sync awards to database
        $awardsData = $state['awards'] ?? [];
        $processedIds = [];

        foreach ($awardsData as $index => $awardState) {
            $awardId = $awardState['id'] ?? null;
            $award = null;

            if ($awardId) {
                $award = \App\Models\Award::find($awardId);
            }

            if (!$award) {
                $award = new \App\Models\Award();
            }

            $award->fill([
                'tier' => $awardState['tier'],
                'count' => $awardState['count'] ?? 1,
                'award_body' => $awardState['award_body'],
                'year' => $awardState['year'],
                'campaign_name' => $awardState['campaign_name'],
                'client_name' => $awardState['client_name'],
                'category' => $awardState['category'],
                'insight' => $awardState['insight'] ?? null,
                'published' => $awardState['published'] ?? true,
                'sort_order' => $awardState['sort_order'] ?? $index,
                'portfolio_item_id' => $awardState['portfolio_item_id'] ?? null,
                'background_path' => $awardState['background_path'] ?? null,
                'client_logo_path' => $awardState['client_logo_path'] ?? null,
            ]);

            $award->save();
            $processedIds[] = $award->id;
        }

        // Delete awards that were removed from the repeater
        \App\Models\Award::whereNotIn('id', $processedIds)->delete();

        // Refresh the form state with the updated data (so new items now have their database IDs populated)
        $this->form->fill([
            'hero' => $state['hero'],
            'stats' => $state['stats'],
            'disciplines' => $state['disciplines'],
            'process' => $state['process'],
            'past_events' => $state['past_events'],
            'gallery' => $state['gallery'] ?? [],
            'awards' => \App\Models\Award::orderBy('sort_order')->orderByDesc('year')->get()->toArray(),
        ]);

        Notification::make()
            ->title('Events Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
