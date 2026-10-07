<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    protected $fillable = ['from_path', 'to_path', 'type', 'active', 'hits'];

    protected $casts = ['active' => 'boolean'];

    public function incrementHits(): void
    {
        $this->increment('hits');
    }

    public static function findMatch(string $path): ?self
    {
        return static::where('from_path', $path)
            ->where('active', true)
            ->first();
    }
}
