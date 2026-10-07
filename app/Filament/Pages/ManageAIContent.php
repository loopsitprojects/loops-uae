<?php

namespace App\Filament\Pages;

use App\Models\Service;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;

class ManageAIContent extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-cpu-chip';
    protected static string | \UnitEnum | null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 9;
    protected static ?string $navigationLabel = 'AI Content Page';
    protected ?string $heading = 'Manage AI Content Page';

    protected string $view = 'filament.pages.manage-service';

    public ?array $data = [];

    public function mount(): void
    {
        $service = Service::where('slug', 'ai-content')->first();
        if (!$service) {
            abort(404, 'AI Content service page not found.');
        }

        $this->form->fill([
            'title' => $service->title,
            'headline' => $service->headline,
            'subheadline' => $service->subheadline,
            'description' => $service->description,
            'cta_label' => $service->cta_label,
            'cta_link' => $service->cta_link,
            'accent_color' => $service->accent_color,
            'icon' => $service->icon,
            'published' => $service->published,
            'meta_title' => $service->meta_title,
            'meta_description' => $service->meta_description,
            'what_we_do_text' => $service->what_we_do_text,
            'capabilities' => $service->capabilities->map(fn ($c) => [
                'label' => $c->label,
                'description' => $c->description,
                'sort_order' => $c->sort_order,
            ])->toArray(),
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Tabs::make('Tabs')
                    ->tabs([
                        Tabs\Tab::make('Page Hero')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('title')
                                        ->required()
                                        ->maxLength(100),
                                    TextInput::make('headline')
                                        ->required()
                                        ->maxLength(500)
                                        ->columnSpan(2),
                                    TextInput::make('subheadline')
                                        ->required()
                                        ->maxLength(500)
                                        ->columnSpan(2),
                                    Textarea::make('description')
                                        ->nullable()
                                        ->rows(5)
                                        ->columnSpan(2),
                                    Textarea::make('what_we_do_text')
                                        ->label('What We Do Box Text')
                                        ->maxLength(500)
                                        ->columnSpan(2),
                                ]),
                            ]),
                        Tabs\Tab::make('Page Config')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('cta_label')
                                        ->required()
                                        ->maxLength(100),
                                    TextInput::make('cta_link')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('accent_color')
                                        ->required()
                                        ->maxLength(7),
                                    TextInput::make('icon')
                                        ->required()
                                        ->maxLength(20),
                                    Toggle::make('published')
                                        ->required(),
                                ]),
                            ]),
                        Tabs\Tab::make('What We Do')
                            ->schema([
                                Repeater::make('capabilities')
                                    ->label('What We Do Cards')
                                    ->schema([
                                        Grid::make(4)->schema([
                                            TextInput::make('label')
                                                ->label('Card Title')
                                                ->required()
                                                ->columnSpan(3),
                                            TextInput::make('sort_order')
                                                ->label('Sort Order')
                                                ->numeric()
                                                ->default(0)
                                                ->required()
                                                ->columnSpan(1),
                                            Textarea::make('description')
                                                ->label('Card Description')
                                                ->rows(3)
                                                ->nullable()
                                                ->columnSpan(4),
                                        ]),
                                    ])
                                    ->columns(1)
                                    ->addActionLabel('Add What We Do Card')
                                    ->columnSpanFull(),
                            ]),
                        Tabs\Tab::make('SEO & Metadata')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('meta_title')
                                        ->maxLength(255)
                                        ->columnSpan(2),
                                    Textarea::make('meta_description')
                                        ->maxLength(500)
                                        ->rows(3)
                                        ->columnSpan(2),
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
        $service = Service::where('slug', 'ai-content')->first();
        if (!$service) {
            return;
        }

        $service->update([
            'title' => $state['title'],
            'headline' => $state['headline'],
            'subheadline' => $state['subheadline'],
            'description' => $state['description'] ?? null,
            'cta_label' => $state['cta_label'],
            'cta_link' => $state['cta_link'],
            'accent_color' => $state['accent_color'],
            'icon' => $state['icon'],
            'published' => $state['published'],
            'what_we_do_text' => $state['what_we_do_text'] ?? null,
            'meta_title' => $state['meta_title'] ?? null,
            'meta_description' => $state['meta_description'] ?? null,
        ]);

        // Sync capabilities
        $service->capabilities()->delete();
        if (!empty($state['capabilities'])) {
            foreach ($state['capabilities'] as $cap) {
                $service->capabilities()->create([
                    'label' => $cap['label'],
                    'description' => $cap['description'] ?? null,
                    'sort_order' => $cap['sort_order'] ?? 0,
                ]);
            }
        }

        Notification::make()
            ->title('AI Content Page configuration saved successfully!')
            ->success()
            ->send();
    }
}
