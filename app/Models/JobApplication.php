<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class JobApplication extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'job_id', 'name', 'email', 'phone', 'expected_salary', 'portfolio', 'cover_letter', 'cv_path', 'status'
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cv')
            ->singleFile()
            ->acceptsMimeTypes([
                'application/pdf',
                'application/x-pdf',
                'application/acrobat',
                'applications/vnd.pdf',
                'text/pdf',
                'text/x-pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/octet-stream',
            ]);
    }

    public function getCvUrlAttribute(): ?string
    {
        if (!empty($this->cv_path)) {
            $path = ltrim($this->cv_path, '/');
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                return $path;
            }

            $filename = basename($path);
            return asset('public/cv/' . $filename);
        }

        $mediaUrl = $this->getFirstMediaUrl('cv');
        if ($mediaUrl) {
            if (str_starts_with($mediaUrl, 'http://') || str_starts_with($mediaUrl, 'https://')) {
                return $mediaUrl;
            }
            return asset('public/cv/' . basename($mediaUrl));
        }

        return null;
    }
}
