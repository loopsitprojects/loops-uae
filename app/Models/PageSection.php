<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = ['page', 'section', 'data', 'published'];

    protected $casts = [
        'data'      => 'array',
        'published' => 'boolean',
    ];

    public static function getForPage(string $page): array
    {
        return static::where('page', $page)
            ->where('published', true)
            ->get()
            ->keyBy('section')
            ->map(fn ($s) => $s->data)
            ->toArray();
    }

    public static function getSection(string $page, string $section): ?array
    {
        $record = static::where('page', $page)
            ->where('section', $section)
            ->where('published', true)
            ->first();

        return $record?->data;
    }
}
