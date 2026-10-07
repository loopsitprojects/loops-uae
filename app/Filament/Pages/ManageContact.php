<?php

namespace App\Filament\Pages;

use App\Models\PageSection;
use App\Models\Office;
use App\Models\SitePage;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageContact extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-envelope';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 5;
    protected static ?string $navigationLabel = 'Contact Page';
    protected ?string $heading = 'Manage Contact Page';

    protected string $view = 'filament.pages.manage-contact';

    public ?array $data = [];

    public function mount(): void
    {
        $heroRecord = PageSection::where('page', 'contact')->where('section', 'hero')->first();
        $heroData = $heroRecord?->data ?? [];
        $pageRecord = SitePage::where('key', 'contact')->first();

        $hero = [
            'label' => $heroData['label'] ?? 'Get in Touch',
            'headline' => $heroData['headline'] ?? 'Contact Us',
            'subheadline' => $heroData['subheadline'] ?? 'Let\'s create something great together. We\'re ready to partner with ambitious brands across Sri Lanka and the world.',
        ];

        $fieldsRecord = PageSection::where('page', 'contact')->where('section', 'form_fields')->first();
        $fieldsData = $fieldsRecord?->data ?? [];

        $rawOptions = $fieldsData['service_options'] ?? 'Creative,Digital,Play / Productions,Tech,AI Content,Events & Experiences,Full Integrated';
        $serviceOptions = array_map('trim', explode(',', $rawOptions));

        $offices = Office::orderBy('sort_order')->get()->map(function ($office) {
            return [
                'id' => $office->id,
                'city' => $office->city,
                'country' => $office->country,
                'role' => $office->role,
                'description' => $office->description,
                'phone' => $office->phone,
                'email' => $office->email,
                'address' => $office->address,
                'lat' => $office->lat,
                'lng' => $office->lng,
                'is_headquarters' => (bool)$office->is_headquarters,
                'published' => (bool)$office->published,
                'sort_order' => $office->sort_order,
            ];
        })->toArray();

        $this->form->fill([
            'page_settings' => [
                'is_published' => $pageRecord?->is_published ?? true,
                'show_in_nav'  => $pageRecord?->show_in_nav ?? true,
            ],
            'hero' => $hero,
            'service_options' => $serviceOptions,
            'offices' => $offices,
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
                                        ->label('Hero Title')
                                        ->required()
                                        ->columnSpan(1),
                                    Textarea::make('hero.subheadline')
                                        ->label('Hero Subtitle / Description')
                                        ->required()
                                        ->rows(4)
                                        ->columnSpan(2),
                                ]),
                            ]),
                        Tabs\Tab::make('Form Settings')
                            ->schema([
                                TagsInput::make('service_options')
                                    ->label('Service Options')
                                    ->placeholder('Add service option')
                                    ->helperText('Press Enter or comma to add a new option for the "Service Interested In" dropdown list.')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),
                        Tabs\Tab::make('Offices')
                            ->schema([
                                Repeater::make('offices')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('city')
                                                ->required()
                                                ->maxLength(100)
                                                ->columnSpan(1),
                                            TextInput::make('country')
                                                ->required()
                                                ->maxLength(100)
                                                ->columnSpan(1),
                                            TextInput::make('role')
                                                ->required()
                                                ->maxLength(100)
                                                ->placeholder('e.g. Headquarters')
                                                ->columnSpan(1),
                                            TextInput::make('phone')
                                                ->required()
                                                ->maxLength(50)
                                                ->columnSpan(1),
                                            TextInput::make('email')
                                                ->required()
                                                ->maxLength(255)
                                                ->columnSpan(1),
                                            TextInput::make('sort_order')
                                                ->numeric()
                                                ->default(0)
                                                ->required()
                                                ->columnSpan(1),
                                            Textarea::make('address')
                                                ->required()
                                                ->rows(2)
                                                ->columnSpan(2),
                                            Textarea::make('description')
                                                ->rows(2)
                                                ->columnSpan(1),
                                            Grid::make(4)->schema([
                                                TextInput::make('lat')
                                                    ->numeric()
                                                    ->default(0)
                                                    ->columnSpan(1),
                                                TextInput::make('lng')
                                                    ->numeric()
                                                    ->default(0)
                                                    ->columnSpan(1),
                                                \Filament\Forms\Components\Toggle::make('is_headquarters')
                                                    ->label('Is Headquarters?')
                                                    ->columnSpan(1),
                                                \Filament\Forms\Components\Toggle::make('show_in_footer')
                                                    ->label('Show in Footer')
                                                    ->default(true)
                                                    ->columnSpan(1),
                                                \Filament\Forms\Components\Toggle::make('published')
                                                    ->label('Published')
                                                    ->default(true)
                                                    ->columnSpan(1),
                                            ])->columnSpan(3),
                                        ]),
                                    ])
                                    ->orderColumn('sort_order')
                                    ->addActionLabel('Add Office')
                                    ->columnSpanFull(),
                            ]),
                        Tabs\Tab::make('Publication Status')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Grid::make(2)->schema([
                                    Toggle::make('page_settings.is_published')
                                        ->label('Page Published')
                                        ->helperText('When unpublished, the Contact page is unavailable on the public website.')
                                        ->default(true),
                                    Toggle::make('page_settings.show_in_nav')
                                        ->label('Publish in Nav Bar')
                                        ->helperText('When enabled, the Contact / Let\'s Talk button appears in the navigation bar.')
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
            ['key' => 'contact'],
            [
                'label'        => 'Contact',
                'url'          => '/contact',
                'nav_group'    => 'cta',
                'is_published' => $isPublished,
                'show_in_nav'  => $showInNav,
            ]
        );

        // Save hero section
        PageSection::updateOrCreate(
            ['page' => 'contact', 'section' => 'hero'],
            ['data' => $state['hero'], 'published' => $isPublished]
        );

        // Save service options
        $optionsString = implode(',', $state['service_options']);
        PageSection::updateOrCreate(
            ['page' => 'contact', 'section' => 'form_fields'],
            ['data' => ['service_options' => $optionsString], 'published' => $isPublished]
        );

        // Save offices list
        $submittedIds = collect($state['offices'])->pluck('id')->filter()->toArray();
        Office::whereNotIn('id', $submittedIds)->delete();

        foreach ($state['offices'] as $index => $officeData) {
            Office::updateOrCreate(
                ['id' => $officeData['id'] ?? null],
                [
                    'city' => $officeData['city'],
                    'country' => $officeData['country'],
                    'role' => $officeData['role'],
                    'description' => $officeData['description'] ?? null,
                    'phone' => $officeData['phone'],
                    'email' => $officeData['email'],
                    'address' => $officeData['address'],
                    'lat' => $officeData['lat'] ?? 0,
                    'lng' => $officeData['lng'] ?? 0,
                    'is_headquarters' => (bool)($officeData['is_headquarters'] ?? false),
                    'published' => (bool)($officeData['published'] ?? true),
                    'sort_order' => $officeData['sort_order'] ?? $index,
                ]
            );
        }

        Notification::make()
            ->title('Contact Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
