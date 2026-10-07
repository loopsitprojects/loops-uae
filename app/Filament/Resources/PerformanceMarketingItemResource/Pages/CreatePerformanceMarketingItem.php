<?php

namespace App\Filament\Resources\PerformanceMarketingItemResource\Pages;

use App\Filament\Resources\PerformanceMarketingItemResource;
use App\Models\PortfolioCategory;
use Filament\Resources\Pages\CreateRecord;

class CreatePerformanceMarketingItem extends CreateRecord
{
    protected static string $resource = PerformanceMarketingItemResource::class;

    protected function afterCreate(): void
    {
        $this->record->addMediaFromUrls(
            $this->data['image_url'] ?? $this->data['hero_image_url'] ?? null,
            $this->data['gallery_image_urls'] ?? null
        );

        $category = PortfolioCategory::where('slug', 'performance-marketing')
            ->orWhere('name', 'Performance Marketing')
            ->first();

        if ($category && !$this->record->categories->contains($category->id)) {
            $this->record->categories()->attach($category->id);
        }
    }
}
