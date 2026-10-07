<?php

namespace App\Filament\Pages;

use App\Models\PageSection;
use App\Models\SitePage;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageWork extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-briefcase';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 3;
    protected static ?string $navigationLabel = 'Work Page';
    protected ?string $heading = 'Manage Work Page';

    protected string $view = 'filament.pages.manage-work';

    public ?array $data = [];

    public function mount(): void
    {
        $heroRecord = PageSection::where('page', 'work')->where('section', 'hero')->first();
        $hero = $heroRecord?->data ?? [];
        $pageRecord = SitePage::where('key', 'work')->first();

        $latestWorkRecord = PageSection::where('page', 'home')->where('section', 'latest_work')->first();
        $showViewAllOnHome = (bool) ($latestWorkRecord?->data['show_view_all'] ?? false);

        $this->form->fill([
            'page_settings' => [
                'is_published' => $pageRecord?->is_published ?? true,
                'show_in_nav'  => $pageRecord?->show_in_nav ?? true,
            ],
            'homepage_show_view_all' => $showViewAllOnHome,
            'hero' => $hero,
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Publication Status')
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('page_settings.is_published')
                                ->label('Page Published')
                                ->helperText('When unpublished, the Work page is unavailable on the public website.')
                                ->default(true),
                            Toggle::make('page_settings.show_in_nav')
                                ->label('Publish in Nav Bar')
                                ->helperText('When enabled, the Work link appears in the navigation bar.')
                                ->default(true),
                        ]),
                    ]),
                Section::make('Homepage Link & Card')
                    ->schema([
                        Toggle::make('homepage_show_view_all')
                            ->label('Show "View All Work" Link & Card on Homepage')
                            ->helperText('When disabled, the "View All Work ->" header link and the dashed carousel end card on the homepage are hidden.')
                            ->default(false),
                    ]),
                Section::make('Hero Content')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('hero.label')
                                ->label('Hero Label')
                                ->required()
                                ->columnSpan(2),
                            TextInput::make('hero.headline')
                                ->label('Headline')
                                ->required()
                                ->columnSpan(2),
                            Textarea::make('hero.description_line1')
                                ->label('Headline Paragraph 1')
                                ->required()
                                ->rows(3)
                                ->columnSpan(2),
                            Textarea::make('hero.description_line2')
                                ->label('Headline Paragraph 2')
                                ->required()
                                ->rows(3)
                                ->columnSpan(2),
                        ]),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        $isPublished = $state['page_settings']['is_published'] ?? true;
        $showInNav   = $state['page_settings']['show_in_nav'] ?? true;

        SitePage::updateOrCreate(
            ['key' => 'work'],
            [
                'label'        => 'Work',
                'url'          => '/work',
                'nav_group'    => 'top',
                'is_published' => $isPublished,
                'show_in_nav'  => $showInNav,
            ]
        );

        if (isset($state['homepage_show_view_all'])) {
            $latestWorkRecord = PageSection::where('page', 'home')->where('section', 'latest_work')->first();
            $lwData = $latestWorkRecord?->data ?? [
                'is_visible' => true,
                'label' => 'Latest Work',
                'title_line1' => 'Real campaigns.',
                'title_line2' => 'Real results.',
            ];
            $lwData['show_view_all'] = (bool) $state['homepage_show_view_all'];
            PageSection::updateOrCreate(
                ['page' => 'home', 'section' => 'latest_work'],
                ['data' => $lwData, 'published' => true]
            );
        }

        PageSection::updateOrCreate(
            ['page' => 'work', 'section' => 'hero'],
            ['data' => $state['hero'], 'published' => $isPublished]
        );

        Notification::make()
            ->title('Work Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
