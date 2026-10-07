<?php

namespace App\Filament\Pages;

use App\Models\PageSection;
use App\Models\SitePage;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageAbout extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-information-circle';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 4;
    protected static ?string $navigationLabel = 'About Page';
    protected ?string $heading = 'Manage About Page';

    protected string $view = 'filament.pages.manage-about';

    public ?array $data = [];

    public function mount(): void
    {
        $heroData = PageSection::where('page', 'about')->where('section', 'hero')->first()?->data ?? [];
        $statementData = PageSection::where('page', 'about')->where('section', 'statement')->first()?->data ?? [];
        $recognitionData = PageSection::where('page', 'about')->where('section', 'recognition')->first()?->data ?? [];
        $ctaData = PageSection::where('page', 'about')->where('section', 'cta')->first()?->data ?? [];
        $pageRecord = SitePage::where('key', 'about')->first();

        $this->form->fill([
            'page_settings' => [
                'is_published' => $pageRecord?->is_published ?? true,
                'show_in_nav'  => $pageRecord?->show_in_nav ?? true,
            ],
            'hero' => [
                'label' => $heroData['label'] ?? 'Who We Are',
                'headline' => $heroData['headline'] ?? 'A creative-led agency for ambitious brands.',
                'description' => $heroData['description'] ?? "We're a collective of strategists, designers, technologists, and storytellers building brand momentum for companies across Sri Lanka and beyond.",
            ],
            'statement' => [
                'label' => $statementData['label'] ?? 'Our Philosophy',
                'text' => $statementData['text'] ?? "We believe bold ideas, backed by sharp strategy, are what move people — and move business. Every discipline under one roof, working as one integrated team.",
            ],
            'recognition' => [
                'label' => $recognitionData['label'] ?? 'Industry Recognition',
                'headline_line1' => $recognitionData['headline_line1'] ?? 'Work that wins',
                'headline_highlight' => $recognitionData['headline_highlight'] ?? 'awards.',
            ],
            'cta' => [
                'label' => $ctaData['label'] ?? 'Next Step',
                'headline' => $ctaData['headline'] ?? 'Ready to create something great together?',
                'button_label' => $ctaData['button_label'] ?? "Let's Talk",
                'button_link' => $ctaData['button_link'] ?? '/contact',
            ],
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
                                        ->label('Top Label / Badge')
                                        ->required()
                                        ->columnSpan(2),
                                    TextInput::make('hero.headline')
                                        ->label('Main Headline')
                                        ->required()
                                        ->columnSpan(2),
                                    Textarea::make('hero.description')
                                        ->label('Description / Subhead')
                                        ->required()
                                        ->rows(4)
                                        ->columnSpan(2),
                                ]),
                            ]),
                        Tabs\Tab::make('Philosophy Section')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('statement.label')
                                        ->label('Section Subtitle')
                                        ->required()
                                        ->columnSpan(2),
                                    Textarea::make('statement.text')
                                        ->label('Philosophy Statement / Quote')
                                        ->required()
                                        ->rows(4)
                                        ->columnSpan(2),
                                ]),
                            ]),
                        Tabs\Tab::make('Industry Recognition')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('recognition.label')
                                        ->label('Section Subtitle')
                                        ->required()
                                        ->columnSpan(2),
                                    TextInput::make('recognition.headline_line1')
                                        ->label('Headline Line 1')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('recognition.headline_highlight')
                                        ->label('Gradient Highlight Text')
                                        ->required()
                                        ->columnSpan(1),
                                ]),
                            ]),
                        Tabs\Tab::make('CTA Section')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('cta.label')
                                        ->label('Section Label')
                                        ->required()
                                        ->columnSpan(2),
                                    TextInput::make('cta.headline')
                                        ->label('Headline')
                                        ->required()
                                        ->columnSpan(2),
                                    TextInput::make('cta.button_label')
                                        ->label('Button Label')
                                        ->required()
                                        ->columnSpan(1),
                                    TextInput::make('cta.button_link')
                                        ->label('Button Link Target')
                                        ->required()
                                        ->columnSpan(1),
                                ]),
                            ]),
                        Tabs\Tab::make('Publication Status')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Grid::make(2)->schema([
                                    Toggle::make('page_settings.is_published')
                                        ->label('Page Published')
                                        ->helperText('When unpublished, the About page is unavailable on the public website.')
                                        ->default(true),
                                    Toggle::make('page_settings.show_in_nav')
                                        ->label('Publish in Nav Bar')
                                        ->helperText('When enabled, the About link appears in the navigation bar.')
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
            ['key' => 'about'],
            [
                'label'        => 'About',
                'url'          => '/about',
                'nav_group'    => 'top',
                'is_published' => $isPublished,
                'show_in_nav'  => $showInNav,
            ]
        );

        PageSection::updateOrCreate(
            ['page' => 'about', 'section' => 'hero'],
            ['data' => $state['hero'], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'about', 'section' => 'statement'],
            ['data' => $state['statement'], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'about', 'section' => 'recognition'],
            ['data' => $state['recognition'], 'published' => $isPublished]
        );

        PageSection::updateOrCreate(
            ['page' => 'about', 'section' => 'cta'],
            ['data' => $state['cta'], 'published' => $isPublished]
        );

        Notification::make()
            ->title('About Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
