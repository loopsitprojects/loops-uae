<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $fillable = [
        'city', 'country', 'role', 'description',
        'phone', 'email', 'address', 'lat', 'lng',
        'is_headquarters', 'show_in_footer', 'sort_order', 'published',
    ];

    protected $casts = [
        'is_headquarters' => 'boolean',
        'show_in_footer'   => 'boolean',
        'published'       => 'boolean',
        'lat'             => 'float',
        'lng'             => 'float',
    ];
}
