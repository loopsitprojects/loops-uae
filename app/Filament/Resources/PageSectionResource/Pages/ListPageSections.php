<?php

namespace App\Filament\Resources\PageSectionResource\Pages;

use App\Filament\Resources\PageSectionResource;
use Filament\Actions;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListPageSections extends ListRecords
{
    protected static string $resource = PageSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getTableQuery(): Builder
    {
        $query = static::getResource()::getEloquentQuery();

        if (filled($this->activeTab) && $this->activeTab !== 'all') {
            $query->where('page', $this->activeTab);
        }

        return $query;
    }

    public function getTabs(): array
    {
        return [
            'all'        => Tab::make('All'),
            'global'     => Tab::make('Global / Site-wide'),
            'home'       => Tab::make('Home'),
            'work'       => Tab::make('Work'),
            'contact'    => Tab::make('Contact'),
            'creative'   => Tab::make('Creative'),
            'digital'    => Tab::make('Digital'),
            'play'       => Tab::make('Play'),
            'tech'       => Tab::make('Tech'),
            'ai-content' => Tab::make('AI Content'),
            'events'     => Tab::make('Events'),
        ];
    }
}
