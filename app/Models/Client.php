<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Client extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['name', 'logo_domain', 'url', 'sort_order', 'published'];

    protected $casts = ['published' => 'boolean'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // Skip conversions for SVG — they're already vectors
        if ($media && $media->mime_type === 'image/svg+xml') return;

        $this->addMediaConversion('strip')
            ->width(300)
            ->height(120)
            ->keepOriginalImageFormat()
            ->nonQueued();
    }

    public function getLogoUrlAttribute(): ?string
    {
        // Prefer uploaded media (strip conversion if available, else full)
        $uploaded = $this->getFirstMediaUrl('logo', 'strip') ?: $this->getFirstMediaUrl('logo');
        if ($uploaded) return $uploaded;

        // Google Favicon API fallback
        return $this->logo_domain
          ? "https://www.google.com/s2/favicons?domain={$this->logo_domain}&sz=128"
          : null;
    }
}
