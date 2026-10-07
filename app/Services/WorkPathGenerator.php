<?php

namespace App\Services;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class WorkPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        $model = $media->model;
        $folderName = ($model && !empty($model->slug)) ? $model->slug : ($media->model_id ?? 'general');
        return "{$folderName}/";
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->getPath($media);
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getPath($media);
    }
}
