<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'description',
        'cta_label',
        'cta_link',
        'image_url',
        'sort_order',
        'published',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
    }

    public function getImageUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('image');
        if ($media && file_exists($media->getPath())) {
            return $media->getUrl();
        }

        if (!empty($this->attributes['image_url'])) {
            return $this->attributes['image_url'];
        }

        $defaults = [
            'Custom CRM Development' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
            'Custom Internal HR Portal' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
            'Custom AI Virtual Try-On App' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
            'Custom AI Virtual "Maliban Real Temptation"' => '/images/tech-works/maliban-real-temptation.png',
            'AI Integrated Websites' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            'Multilingual AI Chatbots' => 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=800&q=80',
            'Martech Events' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        ];

        return $defaults[$this->title] ?? null;
    }
}
