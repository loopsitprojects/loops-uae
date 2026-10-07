<?php

namespace App\Filament\Pages;

use App\Models\PageSection;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Schema;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageAwards extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-trophy';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 4;
    protected static ?string $navigationLabel = 'Awards Page Settings';
    protected ?string $heading = 'Manage Awards Page Settings';

    protected string $view = 'filament.pages.manage-awards';

    public ?array $data = [];

    public function mount(): void
    {
        $heroRecord = PageSection::where('page', 'awards')->where('section', 'hero')->first();
        $hero = $heroRecord?->data ?? [];

        $accoladesRecord = PageSection::where('page', 'awards')->where('section', 'accolades')->first();
        $accolades = $accoladesRecord?->data['accolades'] ?? [];

        $this->form->fill([
            'hero' => $hero,
            'accolades' => $accolades,
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
                                        ->label('Headline Gradient Part (e.g. gold.)')
                                        ->required()
                                        ->columnSpan(1),
                                    Textarea::make('hero.description')
                                        ->label('Description')
                                        ->required()
                                        ->rows(4)
                                        ->columnSpan(2),
                                ]),
                            ]),
                        Tabs\Tab::make('Accolades')
                            ->schema([
                                Repeater::make('accolades')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('icon')
                                                ->label('Icon Symbol')
                                                ->required()
                                                ->placeholder('e.g. ◎')
                                                ->columnSpan(1),
                                            TextInput::make('text')
                                                ->label('Accolade Title')
                                                ->required()
                                                ->placeholder('e.g. Campaign Excellence')
                                                ->columnSpan(2),
                                            Textarea::make('sub')
                                                ->label('Description')
                                                ->required()
                                                ->rows(2)
                                                ->columnSpan(3),
                                        ])
                                    ])
                                    ->addActionLabel('Add Accolade')
                                    ->columnSpanFull(),
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
            ['page' => 'awards', 'section' => 'hero'],
            ['data' => $state['hero'], 'published' => true]
        );

        PageSection::updateOrCreate(
            ['page' => 'awards', 'section' => 'accolades'],
            ['data' => ['accolades' => $state['accolades'] ?? []], 'published' => true]
        );

        Notification::make()
            ->title('Awards Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
