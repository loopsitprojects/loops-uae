<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SitePage extends Model
{
    protected $fillable = [
        'key',
        'label',
        'url',
        'nav_group',
        'is_published',
        'show_in_nav',
        'sort_order',
        'icon',
        'description',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'show_in_nav'  => 'boolean',
        'sort_order'   => 'integer',
    ];

    protected static function booted()
    {
        static::saved(function (SitePage $page) {
            // Synchronize with services table if this page is a service
            $serviceSlugs = ['creative', 'digital', 'tech', 'play', 'ai-content', 'performance-marketing', 'events'];
            if (in_array($page->key, $serviceSlugs)) {
                Service::where('slug', $page->key)->update([
                    'published' => $page->is_published,
                ]);
            }
        });
    }

    public static function isNavbarPublished(): bool
    {
        $record = PageSection::where('page', 'global')->where('section', 'navigation')->first();
        if ($record && isset($record->data['navbar_published'])) {
            return (bool) $record->data['navbar_published'];
        }
        return true;
    }

    public static function setNavbarPublished(bool $published): void
    {
        $record = PageSection::firstOrNew([
            'page'    => 'global',
            'section' => 'navigation',
        ]);

        $data = $record->data ?? [];
        $data['navbar_published'] = $published;

        $record->data = $data;
        $record->published = true;
        $record->save();
    }
}
