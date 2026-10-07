<?php

namespace App\Filament\Pages;

use App\Models\PageSection;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageHome extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-home';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'Home Page';
    protected ?string $heading = 'Manage Home Page';

    protected string $view = 'filament.pages.manage-home';

    public ?array $data = [];

    public function mount(): void
    {
        $heroRecord = PageSection::where('page', 'home')->where('section', 'hero')->first();
        $hero = $heroRecord?->data ?? [];

        $badgesRecord = PageSection::where('page', 'home')->where('section', 'badges')->first();
        $badges = $badgesRecord?->data['badges'] ?? [];

        $statsRecord = PageSection::where('page', 'home')->where('section', 'stats')->first();
        $stats = $statsRecord?->data['stats'] ?? [];

        $newsletterRecord = PageSection::where('page', 'home')->where('section', 'newsletter')->first();
        $newsletter = $newsletterRecord?->data ?? [];

        $latestWorkRecord = PageSection::where('page', 'home')->where('section', 'latest_work')->first();
        $latestWork = array_merge([
            'is_visible' => true,
            'show_view_all' => false,
            'label' => 'Latest Work',
            'title_line1' => 'Real campaigns.',
            'title_line2' => 'Real results.',
        ], $latestWorkRecord?->data ?? []);

        $this->form->fill([
            'hero' => $hero,
            'badges' => $badges,
            'stats' => $stats,
            'latest_work' => $latestWork,
            'newsletter' => $newsletter,
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
                                    TextInput::make('hero.headline')
                                        ->label('Headline')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('hero.headline_gradient')
                                        ->label('Headline Gradient Part')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('hero.subheadline')
                                        ->label('Subheadline (Short Intro)')
                                        ->required()
                                        ->columnSpan(2),
                                    Textarea::make('hero.description')
                                        ->label('Description')
                                        ->required()
                                        ->rows(4)
                                        ->columnSpan(2),
                                    TextInput::make('hero.cta_label')
                                        ->label('Primary CTA Label')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('hero.cta_link')
                                        ->label('Primary CTA Link')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('hero.cta_secondary_label')
                                        ->label('Secondary CTA Label')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('hero.cta_secondary_link')
                                        ->label('Secondary CTA Link')
                                        ->required()
                                        ->columnSpan(1),
                                ]),
                            ]),
                        Tabs\Tab::make('Floating Badges')
                            ->schema([
                                Repeater::make('badges')
                                    ->schema([
                                        Grid::make(4)->schema([
                                            TextInput::make('label')
                                                ->required()
                                                ->placeholder('e.g. 3.2M')
                                                ->columnSpan(1),
                                            TextInput::make('sub')
                                                ->required()
                                                ->placeholder('e.g. Impressions')
                                                ->columnSpan(1),
                                            TextInput::make('color')
                                                ->required()
                                                ->placeholder('e.g. #00B4B4')
                                                ->columnSpan(1),
                                            TextInput::make('top')
                                                ->placeholder('e.g. -22px')
                                                ->columnSpan(1),
                                            TextInput::make('bottom')
                                                ->placeholder('e.g. 145px')
                                                ->columnSpan(1),
                                            TextInput::make('left')
                                                ->placeholder('e.g. 14px')
                                                ->columnSpan(1),
                                            TextInput::make('right')
                                                ->placeholder('e.g. 14px')
                                                ->columnSpan(1),
                                        ])
                                    ])
                                    ->addActionLabel('Add Badge')
                                    ->columnSpanFull(),
                            ]),
                        Tabs\Tab::make('Stats Section')
                            ->schema([
                                Repeater::make('stats')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('num')
                                                ->label('Stat Number')
                                                ->required()
                                                ->placeholder('e.g. 150+'),
                                            TextInput::make('label')
                                                ->label('Stat Label')
                                                ->required()
                                                ->placeholder('e.g. Brands Served'),
                                        ])
                                    ])
                                    ->addActionLabel('Add Stat')
                                    ->columnSpanFull(),
                            ]),
                        Tabs\Tab::make('Latest Work Section')
                            ->schema([
                                Section::make('Display & Visibility')
                                    ->description('Control the visibility of the Latest Work section and navigation elements.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Toggle::make('latest_work.is_visible')
                                                ->label('Show "Latest Work" Section')
                                                ->helperText('Display or hide the entire Latest Work showcase section on the homepage.')
                                                ->default(true),
                                            Toggle::make('latest_work.show_view_all')
                                                ->label('Show "View All Work" Link & Card')
                                                ->helperText('Display or hide the "View All Work ->" header link and the dashed carousel end card.')
                                                ->default(false),
                                        ]),
                                    ]),
                                Section::make('Section Copy')
                                    ->description('Customize the headings displayed at the top of the Latest Work section.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('latest_work.label')
                                                ->label('Section Label')
                                                ->default('Latest Work')
                                                ->columnSpan(1),
                                            TextInput::make('latest_work.title_line1')
                                                ->label('Headline Line 1')
                                                ->default('Real campaigns.')
                                                ->columnSpan(1),
                                            TextInput::make('latest_work.title_line2')
                                                ->label('Headline Line 2')
                                                ->default('Real results.')
                                                ->columnSpan(1),
                                        ]),
                                    ]),
                            ]),
                        Tabs\Tab::make('Newsletter')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('newsletter.headline')
                                        ->label('Newsletter Headline')
                                        ->required()
                                        ->columnSpan(2),
                                    Textarea::make('newsletter.subheadline')
                                        ->label('Newsletter Subheadline')
                                        ->required()
                                        ->rows(3)
                                        ->columnSpan(2),
                                    TextInput::make('newsletter.cta_label')
                                        ->label('CTA Button Label')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('newsletter.placeholder')
                                        ->label('Input Placeholder')
                                        ->required()
                                        ->columnSpan(1),
                                ])
                            ]),
                    ])
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        PageSection::updateOrCreate(
            ['page' => 'home', 'section' => 'hero'],
            ['data' => $state['hero'], 'published' => true]
        );

        PageSection::updateOrCreate(
            ['page' => 'home', 'section' => 'badges'],
            ['data' => ['badges' => $state['badges'] ?? []], 'published' => true]
        );

        PageSection::updateOrCreate(
            ['page' => 'home', 'section' => 'stats'],
            ['data' => ['stats' => $state['stats'] ?? []], 'published' => true]
        );

        PageSection::updateOrCreate(
            ['page' => 'home', 'section' => 'latest_work'],
            [
                'data' => $state['latest_work'] ?? [],
                'published' => true,
            ]
        );

        PageSection::updateOrCreate(
            ['page' => 'home', 'section' => 'newsletter'],
            ['data' => $state['newsletter'], 'published' => true]
        );

        Notification::make()
            ->title('Home Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
