<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SitePage;
use Illuminate\Http\JsonResponse;

class NavigationController extends Controller
{
    public function index(): JsonResponse
    {
        $navbarPublished = SitePage::isNavbarPublished();
        $pages = SitePage::orderBy('sort_order')->get();

        return response()->json([
            'navbar_published' => $navbarPublished,
            'pages' => $pages,
        ]);
    }
}
