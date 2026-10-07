<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Award;
use Illuminate\Http\JsonResponse;

class AwardController extends Controller
{
    public function index(): JsonResponse
    {
        $awards = Award::where('published', true)
            ->with(['portfolioItem:id,slug,title,client', 'media'])
            ->orderBy('sort_order')
            ->orderByDesc('year')
            ->get()
            ->map(fn ($a) => [
                'id'            => $a->id,
                'tier'          => $a->tier,
                'count'         => $a->count,
                'award_body'    => $a->award_body,
                'year'          => $a->year,
                'campaign_name' => $a->campaign_name,
                'client_name'   => $a->client_name,
                'category'      => $a->category,
                'insight'       => $a->insight,
                'portfolio_item' => $a->portfolioItem ? [
                    'slug'   => $a->portfolioItem->slug,
                    'title'  => $a->portfolioItem->title,
                    'client' => $a->portfolioItem->client,
                ] : null,
                'background_url' => $a->getFirstMediaUrl('background') 
                    ? $a->getFirstMediaUrl('background') 
                    : ($a->background_path 
                        ? (str_starts_with($a->background_path, 'http') 
                            ? $a->background_path 
                            : asset(ltrim($a->background_path, '/')))
                        : null),
                'client_logo_url' => $a->getFirstMediaUrl('client_logo') 
                    ? $a->getFirstMediaUrl('client_logo') 
                    : ($a->client_logo_path 
                        ? (str_starts_with($a->client_logo_path, 'http') 
                            ? $a->client_logo_path 
                            : asset(ltrim($a->client_logo_path, '/')))
                        : null),
            ]);

        return response()->json(['data' => $awards]);
    }
}
