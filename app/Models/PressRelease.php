<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class PressRelease extends Model implements HasMedia
{
    use HasSlug, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'published_date',
        'author',
        'publisher',
        'external_link',
        'excerpt',
        'content',
        'image_url',
        'video_url',
        'gallery_urls',
        'is_featured',
        'published',
        'sort_order',
    ];

    protected $casts = [
        'published_date' => 'date',
        'is_featured'    => 'boolean',
        'published'      => 'boolean',
        'sort_order'     => 'integer',
        'gallery_urls'   => 'array',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif']);

        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif']);
    }

    public function getImageUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('image');
        if ($media) {
            return $media->getUrl();
        }

        if (!empty($this->attributes['image_url'])) {
            return $this->attributes['image_url'];
        }

        return null;
    }

    public function getFormattedGallery(): array
    {
        $gallery = [];

        foreach ($this->getMedia('gallery') as $m) {
            $gallery[] = [
                'url'     => $m->getUrl(),
                'caption' => $m->getCustomProperty('caption') ?? null,
            ];
        }

        if (is_array($this->gallery_urls)) {
            foreach ($this->gallery_urls as $item) {
                if (is_string($item)) {
                    $url = $item;
                    $caption = null;
                } elseif (is_array($item) && isset($item['url'])) {
                    $url = $item['url'];
                    $caption = $item['caption'] ?? null;
                } else {
                    continue;
                }

                if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                    $url = asset(ltrim($url, '/'));
                }

                $gallery[] = [
                    'url'     => $url,
                    'caption' => $caption,
                ];
            }
        }

        return $gallery;
    }
}
