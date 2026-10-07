<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Award extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'tier', 'count', 'award_body', 'year',
        'campaign_name', 'client_name', 'category', 'insight',
        'published', 'sort_order', 'portfolio_item_id',
        'background_path', 'client_logo_path',
    ];

    protected $casts = [
        'published' => 'boolean',
        'year'      => 'integer',
        'count'     => 'integer',
    ];

    public function portfolioItem(): BelongsTo
    {
        return $this->belongsTo(PortfolioItem::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('background')->singleFile();
        $this->addMediaCollection('client_logo')->singleFile();
    }
}
