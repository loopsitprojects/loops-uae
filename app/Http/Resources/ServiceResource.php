<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'slug'           => $this->slug,
            'title'          => $this->title,
            'headline'       => $this->headline,
            'subheadline'    => $this->subheadline,
            'description'    => $this->description,
            'capabilities'   => $this->capabilities->map(fn ($c) => [
                'id' => $c->id,
                'label' => $c->label,
                'description' => $c->description,
                'sort_order' => $c->sort_order,
            ]),
            'cta_label'      => $this->cta_label,
            'cta_link'       => $this->cta_link,
            'accent_color'   => $this->accent_color,
            'icon'           => $this->icon,
            'what_we_do_text'=> $this->what_we_do_text,
            'hero_url'       => $this->getFirstMediaUrl('hero'),
            'meta' => [
                'title'       => $this->meta_title ?: $this->title . ' | Loops Integrated',
                'description' => $this->meta_description ?: $this->subheadline,
            ],
        ];
    }
}
