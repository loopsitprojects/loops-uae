<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobResource\Pages;
use App\Models\Job;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class JobResource extends Resource
{
    protected static ?string $model = Job::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-briefcase';
    protected static string | \UnitEnum | null $navigationGroup = 'Careers';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Job Opening Details')
                    ->schema([
                        Components\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('title')
                                ->required()
                                ->maxLength(255)
                                ->reactive()
                                ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                            Forms\Components\TextInput::make('slug')
                                ->required()
                                ->maxLength(255)
                                ->unique(ignoreRecord: true),
                            Forms\Components\Select::make('department')
                                ->required()
                                ->options(fn () => \App\Models\JobDepartment::orderBy('sort_order')->orderBy('name')->pluck('name', 'name')->toArray())
                                ->createOptionForm([
                                    Forms\Components\TextInput::make('name')
                                        ->required()
                                        ->unique('job_departments', 'name'),
                                ])
                                ->createOptionUsing(function (array $data): string {
                                    $dept = \App\Models\JobDepartment::create([
                                        'name' => $data['name'],
                                        'slug' => Str::slug($data['name']),
                                    ]);
                                    return $dept->name;
                                }),
                            Forms\Components\TextInput::make('location')
                                ->required()
                                ->maxLength(100)
                                ->default('Colombo, Sri Lanka')
                                ->placeholder('e.g. Colombo, Remote, Hybrid'),
                            Forms\Components\Select::make('type')
                                ->required()
                                ->options([
                                    'Full-time' => 'Full-time',
                                    'Part-time' => 'Part-time',
                                    'Internship' => 'Internship',
                                    'Contract' => 'Contract',
                                ])
                                ->default('Full-time'),
                            Forms\Components\TextInput::make('experience_level')
                                ->placeholder('e.g. Senior, Mid-level, Executive')
                                ->maxLength(100),
                        ]),
                        Components\Grid::make(3)->schema([
                            Forms\Components\TextInput::make('sort_order')
                                ->label('Display Order')
                                ->numeric()
                                ->default(0),
                            Forms\Components\Toggle::make('published')
                                ->default(true)
                                ->inline(false),
                        ]),
                    ]),

                Components\Section::make('Job Description')
                    ->description('Provide the details, responsibilities, and requirements for this role. Supports Markdown formatting.')
                    ->schema([
                        Forms\Components\MarkdownEditor::make('description')
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Components\Section::make('Application Channels')
                    ->description('Set how candidates should submit applications. Leave blank to show the direct online application form.')
                    ->schema([
                        Components\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('apply_link')
                                ->label('External Apply URL')
                                ->url()
                                ->placeholder('https://linkedin.com/... or https://forms.gle/...')
                                ->maxLength(500),
                            Forms\Components\TextInput::make('apply_email')
                                ->label('Fallback Apply Email')
                                ->email()
                                ->placeholder('careers@loopsintegrated.com')
                                ->maxLength(255),
                        ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('department')
                    ->searchable()
                    ->sortable()
                    ->badge(),
                Tables\Columns\TextColumn::make('type')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('location')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
                Tables\Columns\IconColumn::make('published')
                    ->label('Live')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
                Tables\Filters\SelectFilter::make('department')
                    ->options(fn () => \App\Models\JobDepartment::orderBy('sort_order')->orderBy('name')->pluck('name', 'name')->toArray()),
                Tables\Filters\TernaryFilter::make('published')
                    ->label('Live status'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobs::route('/'),
            'create' => Pages\CreateJob::route('/create'),
            'edit' => Pages\EditJob::route('/{record}/edit'),
        ];
    }
}
