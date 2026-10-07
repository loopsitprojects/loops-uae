<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class PortfolioCategory extends Model
{
    use HasSlug;

    protected $fillable = [
        'name', 'slug', 'description', 'color', 'sort_order',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(PortfolioItem::class, 'portfolio_item_category');
    }
}
