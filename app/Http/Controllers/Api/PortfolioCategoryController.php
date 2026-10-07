<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PortfolioCategory;
use Illuminate\Http\JsonResponse;

class PortfolioCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = PortfolioCategory::withCount(['items' => fn ($q) => $q->where('published', true)])
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'id'         => $c->id,
                'name'       => $c->name,
                'slug'       => $c->slug,
                'color'      => $c->color,
                'item_count' => $c->items_count,
            ]);

        return response()->json(['data' => $categories]);
    }
}
