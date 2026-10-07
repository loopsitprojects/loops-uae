<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioItemResource;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PortfolioController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = PortfolioItem::published()
            ->with(['categories', 'tags', 'media'])
            ->orderBy('sort_order')
            ->orderByDesc('year');

        if ($category = $request->get('category')) {
            $catList = is_array($category) ? $category : array_map('trim', explode(',', $category));
            $query->whereHas('categories', function ($q) use ($catList) {
                $q->whereIn('slug', $catList)
                  ->orWhereIn('name', $catList);
            });
        }

        if ($tag = $request->get('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('slug', $tag));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($year = $request->get('year')) {
            $query->where('year', $year);
        }

        $perPage = min((int) $request->get('per_page', 12), 50);

        return PortfolioItemResource::collection(
            $query->paginate($perPage)
        );
    }

    public function show(string $slug): PortfolioItemResource|JsonResponse
    {
        $item = PortfolioItem::published()
            ->with(['categories', 'tags', 'media'])
            ->where('slug', $slug)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return new PortfolioItemResource($item);
    }
}
