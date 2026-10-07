<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobApplicationResource\Pages;
use App\Models\JobApplication;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class JobApplicationResource extends Resource
{
    protected static ?string $model = JobApplication::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-users';
    protected static string | \UnitEnum | null $navigationGroup = 'Careers';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'Applications';

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Applicant Details')
                    ->schema([
                        Components\Grid::make(2)->schema([
                            Forms\Components\Select::make('job_id')
                                ->relationship('job', 'title')
                                ->disabled()
                                ->required(),
                            Forms\Components\Select::make('status')
                                ->options([
                                    'new' => 'New',
                                    'reviewed' => 'Reviewed',
                                    'shortlisted' => 'Shortlisted',
                                    'rejected' => 'Rejected',
                                    'hired' => 'Hired',
                                ])
                                ->required()
                                ->default('new'),
                            Forms\Components\TextInput::make('name')
                                ->disabled()
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('email')
                                ->disabled()
                                ->email()
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('phone')
                                ->disabled()
                                ->tel()
                                ->required()
                                ->maxLength(50),
                            Forms\Components\TextInput::make('expected_salary')
                                ->disabled()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('portfolio')
                                ->disabled()
                                ->url()
                                ->maxLength(255),
                        ]),
                    ]),

                Components\Section::make('Cover Letter')
                    ->schema([
                        Forms\Components\Textarea::make('cover_letter')
                            ->disabled()
                            ->rows(5)
                            ->columnSpanFull(),
                    ]),

                Components\Section::make('Resume / CV')
                    ->schema([
                        Forms\Components\Placeholder::make('cv_download_link')
                            ->label('Attached CV')
                            ->content(function (?JobApplication $record) {
                                $url = $record?->cv_url;
                                if (!$url) {
                                    return 'No CV uploaded.';
                                }
                                return new \Illuminate\Support\HtmlString(
                                    '<a href="' . e($url) . '" target="_blank" class="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-500 underline">' .
                                    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' .
                                    'Download / View CV</a>'
                                );
                            }),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone'),
                Tables\Columns\TextColumn::make('job.title')
                    ->label('Position')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Applied On')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('job_id')
                    ->label('Position')
                    ->relationship('job', 'title'),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'new' => 'New',
                        'reviewed' => 'Reviewed',
                        'shortlisted' => 'Shortlisted',
                        'rejected' => 'Rejected',
                        'hired' => 'Hired',
                    ]),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\Action::make('download_cv')
                    ->label('Download CV')
                    ->icon('heroicon-o-document-arrow-down')
                    ->url(fn ($record) => $record?->cv_url)
                    ->openUrlInNewTab()
                    ->visible(fn ($record) => !empty($record?->cv_url)),
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
            'index' => Pages\ListJobApplications::route('/'),
            'create' => Pages\CreateJobApplication::route('/create'),
            'edit' => Pages\EditJobApplication::route('/{record}/edit'),
        ];
    }
}
