<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $heroUrl = $this->formatMediaUrl($this->hero_url);

        return [
            'id'               => $this->id,
            'slug'             => $this->slug,
            'client'           => $this->formatSriLanka($this->client),
            'title'            => $this->formatSriLanka($this->title),
            'brief'            => $this->formatSriLanka($this->brief),
            'background'       => $this->formatSriLanka($this->background),
            'objective'        => $this->formatSriLanka($this->objective),
            'insight'          => $this->formatSriLanka($this->insight),
            'idea'             => $this->formatSriLanka($this->idea),
            'result'           => $this->formatSriLanka($this->result),
            'video_url'        => $this->video_url,
            'campaign_videos'  => $this->formatCampaignVideos(),
            'year'             => $this->year,
            'color'            => $this->color,
            'image_position'   => $this->image_position ?? 'center',
            'image_fit'        => $this->image_fit ?? 'cover',
            'featured'         => $this->featured,
            'is_clickable'                 => $this->is_clickable ?? true,
            'show_gallery'                 => $this->show_gallery ?? true,
            'show_year'                    => $this->show_year ?? false,
            'show_hero_as_campaign_video'  => $this->show_hero_as_campaign_video ?? true,
            'categories'       => $this->categories->map(fn ($c) => [
                'id'    => $c->id,
                'name'  => $c->name,
                'slug'  => $c->slug,
                'color' => $c->color,
            ]),
            'tags'             => $this->tags->pluck('name'),
            'hero_url'         => $heroUrl,
            'thumbnail_url'    => $heroUrl,
            'award'            => \App\Models\Award::where('portfolio_item_id', $this->id)
                                    ->where('published', true)
                                    ->get()
                                    ->map(fn ($a) => "{$a->count}× {$a->tier} — {$a->award_body}")
                                    ->first(),
            'gallery'          => $this->getFormattedGallery(),
            'meta' => [
                'title'       => $this->seo_title,
                'description' => $this->seo_description,
                'canonical'   => $this->canonical_url,
                'json_ld'     => $this->json_ld,
            ],
        ];
    }

    private function formatSriLanka(?string $text): ?string
    {
        if (!$text) return $text;
        $text = preg_replace('/[\x{2014}\x{2013}]|--/u', '-', $text);
        $text = preg_replace('/ {2,}/', ' ', $text);
        return preg_replace('/Sri\s+(Lanka|Lankan|Lankans)/i', "Sri\u{00A0}$1", $text);
    }

    private function formatMediaUrl(?string $url): ?string
    {
        if (!$url) return null;
        if (str_contains($url, '/works/') || str_contains($url, '/storage/')) {
            $path = parse_url($url, PHP_URL_PATH);
            return $path ?: $url;
        }
        return $url;
    }

    private function getFormattedGallery(): array
    {
        $gallery = [];
        $urlsSeen = [];

        foreach ($this->getMedia('gallery') as $m) {
            $fullUrl = $this->formatMediaUrl($m->getUrl());
            $thumbUrl = $this->formatMediaUrl(
                $m->hasGeneratedConversion('thumb') ? $m->getUrl('thumb') : $m->getUrl()
            );

            if ($fullUrl && !in_array($fullUrl, $urlsSeen)) {
                $gallery[] = [
                    'url'   => $fullUrl,
                    'thumb' => $thumbUrl,
                    'alt'   => $m->custom_properties['alt'] ?? $this->title,
                ];
                $urlsSeen[] = $fullUrl;
            }
        }

        if (is_array($this->gallery_urls)) {
            foreach ($this->gallery_urls as $item) {
                $rawUrl = is_array($item) ? ($item['url'] ?? '') : (is_string($item) ? $item : '');
                $altText = is_array($item) ? ($item['alt'] ?? '') : '';

                if (!empty($rawUrl)) {
                    $convertedUrl = \App\Models\PortfolioItem::convertDirectImageUrl($rawUrl);
                    if ($convertedUrl && !in_array($convertedUrl, $urlsSeen)) {
                        $gallery[] = [
                            'url'   => $convertedUrl,
                            'thumb' => $convertedUrl,
                            'alt'   => !empty($altText) ? $altText : $this->title,
                        ];
                        $urlsSeen[] = $convertedUrl;
                    }
                }
            }
        }

        return $gallery;
    }

    private function formatCampaignVideos(): array
    {
        $videos = [];
        $urlsSeen = [];

        $showHeroAsCampaign = $this->show_hero_as_campaign_video ?? true;

        if (is_array($this->video_urls) && count($this->video_urls) > 0) {
            foreach ($this->video_urls as $v) {
                $url = is_array($v) ? ($v['url'] ?? '') : (is_string($v) ? $v : '');
                $title = is_array($v) ? ($v['title'] ?? '') : '';
                $playerType = is_array($v) ? ($v['player_type'] ?? 'landscape') : 'landscape';

                if (!empty($url) && !in_array(trim($url), $urlsSeen)) {
                    $videos[] = [
                        'title'       => !empty($title) ? $title : ('Video ' . (count($videos) + 1)),
                        'url'         => trim($url),
                        'player_type' => $playerType ?: 'landscape',
                    ];
                    $urlsSeen[] = trim($url);
                }
            }

            if ($showHeroAsCampaign && !empty($this->video_url) && !in_array(trim($this->video_url), $urlsSeen)) {
                $videos[] = [
                    'title'       => 'Main Campaign Video',
                    'url'         => trim($this->video_url),
                    'player_type' => 'landscape',
                ];
                $urlsSeen[] = trim($this->video_url);
            }
        } else {
            if ($showHeroAsCampaign && !empty($this->video_url)) {
                $videos[] = [
                    'title'       => 'Main Campaign Video',
                    'url'         => trim($this->video_url),
                    'player_type' => 'landscape',
                ];
            }
        }

        return $videos;
    }
}
