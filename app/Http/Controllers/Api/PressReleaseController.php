<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PressRelease;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PressReleaseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PressRelease::where('published', true);

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('q')) {
            $q = '%' . $request->q . '%';
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', $q)
                    ->orWhere('excerpt', 'like', $q)
                    ->orWhere('content', 'like', $q)
                    ->orWhere('publisher', 'like', $q);
            });
        }

        $items = $query
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('published_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn ($pr) => $this->formatItem($pr));

        // Also return available categories for the frontend filter pills
        $categories = PressRelease::where('published', true)
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'data' => $items,
            'categories' => $categories,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $item = PressRelease::where('published', true)
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug);
                if (is_numeric($slug)) {
                    $q->orWhere('id', (int) $slug);
                }
            })
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Press release not found'], 404);
        }

        return response()->json(['data' => $this->formatItem($item)]);
    }

    private function formatItem(PressRelease $pr): array
    {
        $imageUrl = $pr->image_url;
        if ($imageUrl && !str_starts_with($imageUrl, 'http://') && !str_starts_with($imageUrl, 'https://')) {
            $imageUrl = asset(ltrim($imageUrl, '/'));
        }

        return [
            'id'             => $pr->id,
            'title'          => $pr->title,
            'slug'           => $pr->slug,
            'category'       => $pr->category,
            'published_date' => $pr->published_date ? $pr->published_date->format('Y-m-d') : null,
            'published_date_formatted' => $pr->published_date ? $pr->published_date->format('jS F Y') : null,
            'author'         => $pr->author,
            'publisher'      => $pr->publisher,
            'external_link'  => $pr->external_link,
            'excerpt'        => $pr->excerpt,
            'content'        => $pr->content,
            'image_url'      => $imageUrl,
            'video_url'      => $pr->video_url,
            'gallery'        => $pr->getFormattedGallery(),
            'is_featured'    => (bool) $pr->is_featured,
            'sort_order'     => (int) $pr->sort_order,
        ];
    }
}
