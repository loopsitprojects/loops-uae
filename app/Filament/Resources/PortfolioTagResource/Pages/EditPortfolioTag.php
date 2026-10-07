<?php

namespace App\Filament\Resources\PortfolioTagResource\Pages;

use App\Filament\Resources\PortfolioTagResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPortfolioTag extends EditRecord
{
    protected static string $resource = PortfolioTagResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
