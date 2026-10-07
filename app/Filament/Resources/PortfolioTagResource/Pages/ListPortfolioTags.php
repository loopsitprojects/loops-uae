<?php

namespace App\Filament\Resources\PortfolioTagResource\Pages;

use App\Filament\Resources\PortfolioTagResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPortfolioTags extends ListRecords
{
    protected static string $resource = PortfolioTagResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
