<?php

namespace App\Filament\Resources\PerformanceMarketingItemResource\Pages;

use App\Filament\Resources\PerformanceMarketingItemResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPerformanceMarketingItems extends ListRecords
{
    protected static string $resource = PerformanceMarketingItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
