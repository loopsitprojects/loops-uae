<?php

namespace App\Filament\Resources\PerformanceMarketingItemResource\Pages;

use App\Filament\Resources\PerformanceMarketingItemResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPerformanceMarketingItem extends EditRecord
{
    protected static string $resource = PerformanceMarketingItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $this->record->addMediaFromUrls(
            $this->data['image_url'] ?? $this->data['hero_image_url'] ?? null,
            $this->data['gallery_image_urls'] ?? null
        );
    }
}
