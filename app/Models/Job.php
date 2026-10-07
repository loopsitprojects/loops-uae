<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Job extends Model
{
    use HasSlug;

    protected $fillable = [
        'title', 'slug', 'department', 'location', 'type', 
        'experience_level', 'description', 'apply_link', 
        'apply_email', 'sort_order', 'published'
    ];

    protected $casts = [
        'published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class)->orderBy('created_at', 'desc');
    }
}
