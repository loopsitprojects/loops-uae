<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::where('published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($p) => [
                'id'          => $p->id,
                'title'       => $p->title,
                'description' => $p->description,
                'cta_label'   => $p->cta_label ?: 'Learn More',
                'cta_link'    => $p->cta_link ?: '/contact',
                'image_url'   => $p->image_url,
            ]);

        return response()->json(['data' => $products]);
    }
}
