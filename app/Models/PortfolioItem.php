<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class PortfolioItem extends Model implements HasMedia
{
    use HasSlug, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'slug', 'client', 'title', 'brief', 'background', 'objective', 'insight', 'idea',
        'result', 'video_url', 'show_hero_as_campaign_video', 'video_urls', 'image_url', 'image_position', 'image_fit', 'year', 'show_year', 'color', 'featured',
        'published', 'is_clickable', 'show_gallery', 'gallery_urls', 'sort_order',
        'meta_title', 'meta_description', 'canonical_url', 'json_ld',
    ];

    protected $casts = [
        'featured'                     => 'boolean',
        'published'                    => 'boolean',
        'is_clickable'                 => 'boolean',
        'show_gallery'                 => 'boolean',
        'show_year'                    => 'boolean',
        'show_hero_as_campaign_video'  => 'boolean',
        'video_urls'                   => 'array',
        'gallery_urls'                 => 'array',
        'json_ld'                      => 'array',
        'year'                         => 'integer',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['client', 'title'])
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate()
            ->preventOverwrite();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/x-png', 'image/pjpeg', 'application/x-png', 'application/octet-stream']);

        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/x-png', 'image/pjpeg', 'application/x-png', 'application/octet-stream']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(800)
            ->height(500)
            ->sharpen(5)
            ->format('webp');

        $this->addMediaConversion('hero')
            ->width(1920)
            ->height(1080)
            ->format('webp');

        $this->addMediaConversion('og')
            ->width(1200)
            ->height(630)
            ->format('jpg');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(PortfolioCategory::class, 'portfolio_item_category');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(PortfolioTag::class, 'portfolio_item_tag');
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function getHeroUrlAttribute(): ?string
    {
        if (!empty($this->image_url)) {
            return static::convertDirectImageUrl($this->image_url);
        }

        $media = $this->getFirstMedia('hero');
        if ($media && file_exists($media->getPath())) {
            $rawUrl = ($media->hasGeneratedConversion('thumb') && file_exists($media->getPath('thumb')))
                ? $media->getUrl('thumb')
                : $media->getUrl();
            return preg_replace('/^https?:\/\/(127\.0\.0\.1:8000|localhost(:\d+)?)/i', '', $rawUrl);
        }
        if ($media) {
            return preg_replace('/^https?:\/\/(127\.0\.0\.1:8000|localhost(:\d+)?)/i', '', $media->getUrl());
        }
        return null;
    }

    public function getSeoTitleAttribute(): string
    {
        return $this->meta_title
            ?? "{$this->title} — {$this->client} | Loops Integrated";
    }

    public function getSeoDescriptionAttribute(): string
    {
        return $this->meta_description
            ?? substr((string) ($this->brief ?? $this->background ?? ''), 0, 160);
    }

    public static function convertDirectImageUrl(string $url): string
    {
        $url = trim($url);
        if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $m)) {
            return "https://lh3.googleusercontent.com/d/{$m[1]}";
        }
        if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $url, $m)) {
            return "https://lh3.googleusercontent.com/d/{$m[1]}";
        }
        if (preg_match('/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/', $url, $m)) {
            return "https://lh3.googleusercontent.com/d/{$m[1]}";
        }
        return $url;
    }

    public function addMediaFromUrls(?string $heroImageUrl = null, ?string $galleryImageUrls = null): void
    {
        $hasUploadedHero = $this->hasMedia('hero');

        if ($heroImageUrl) {
            $formattedUrl = static::convertDirectImageUrl($heroImageUrl);
            $this->update(['image_url' => $formattedUrl]);

            if (!$hasUploadedHero) {
                try {
                    $this->clearMediaCollection('hero');
                    $this->addMediaFromUrl($formattedUrl)
                        ->withCustomProperties(['original_url' => $formattedUrl])
                        ->toMediaCollection('hero');
                } catch (\Exception $e) {
                    \Filament\Notifications\Notification::make()
                        ->title('Hero Image URL Saved to Database')
                        ->body("Stored direct image link: {$formattedUrl}. Local thumbnail copy couldn't be downloaded: {$e->getMessage()}")
                        ->warning()
                        ->persistent()
                        ->send();
                }
            }
        }

        if ($galleryImageUrls) {
            $urls = preg_split('/\r\n|\r|\n/', $galleryImageUrls);
            foreach ($urls as $url) {
                $url = trim($url);
                if (empty($url)) {
                    continue;
                }
                $formattedUrl = static::convertDirectImageUrl($url);
                try {
                    $this->addMediaFromUrl($formattedUrl)
                        ->withCustomProperties(['original_url' => $formattedUrl])
                        ->toMediaCollection('gallery');
                } catch (\Exception $e) {
                    \Filament\Notifications\Notification::make()
                        ->title('Failed to download gallery image')
                        ->body("Could not download from URL: {$url}. Error: {$e->getMessage()}")
                        ->danger()
                        ->persistent()
                        ->send();
                }
            }
        }
    }
}
