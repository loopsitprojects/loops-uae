<?php

namespace App\Filament\Resources\PressReleaseResource\Pages;

use App\Filament\Resources\PressReleaseResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPressRelease extends EditRecord
{
    protected static string $resource = PressReleaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
