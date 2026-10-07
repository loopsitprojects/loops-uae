<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JobDepartment extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function ($department) {
            if (empty($department->slug)) {
                $department->slug = Str::slug($department->name);
            }
        });

        static::updating(function ($department) {
            if ($department->isDirty('name') && !$department->isDirty('slug')) {
                $department->slug = Str::slug($department->name);
            }
        });
    }
}
