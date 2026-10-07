<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Service extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'slug', 'title', 'headline', 'subheadline', 'description',
        'cta_label', 'cta_link', 'accent_color', 'icon',
        'sort_order', 'published', 'meta_title', 'meta_description',
        'what_we_do_text',
    ];

    protected $casts = ['published' => 'boolean'];

    protected static function booted()
    {
        static::saved(function (Service $service) {
            SitePage::where('key', $service->slug)->update([
                'is_published' => $service->published,
            ]);
        });
    }

    public function capabilities(): HasMany
    {
        return $this->hasMany(ServiceCapability::class)->orderBy('sort_order');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero')->singleFile();
    }

    public function getCapabilitiesListAttribute(): array
    {
        return $this->capabilities->map(fn ($c) => [
            'id' => $c->id,
            'label' => $c->label,
            'description' => $c->description,
            'sort_order' => $c->sort_order,
        ])->toArray();
    }

    public function getSeoTitleAttribute(): string
    {
        return $this->meta_title
            ?? "{$this->title} Services | Loops Integrated";
    }
}
