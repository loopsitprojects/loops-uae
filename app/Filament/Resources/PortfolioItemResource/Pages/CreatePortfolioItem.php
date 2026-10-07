<?php

namespace App\Filament\Resources\PortfolioItemResource\Pages;

use App\Filament\Resources\PortfolioItemResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePortfolioItem extends CreateRecord
{
    protected static string $resource = PortfolioItemResource::class;

    protected function afterCreate(): void
    {
        $heroUrl = is_string($this->data['image_url'] ?? $this->data['hero_image_url'] ?? null) 
            ? ($this->data['image_url'] ?? $this->data['hero_image_url']) 
            : null;
        $galleryUrls = is_string($this->data['gallery_image_urls'] ?? null) 
            ? $this->data['gallery_image_urls'] 
            : null;

        if ($heroUrl || $galleryUrls) {
            $this->record->addMediaFromUrls($heroUrl, $galleryUrls);
        }
    }
}
