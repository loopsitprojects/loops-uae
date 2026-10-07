<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageSectionController extends Controller
{
    public function show(Request $request, string $page): JsonResponse
    {
        $sections = PageSection::getForPage($page);

        if (empty($sections)) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json(['data' => $sections]);
    }

    public function section(string $page, string $section): JsonResponse
    {
        $data = PageSection::getSection($page, $section);

        if ($data === null) {
            return response()->json(['message' => 'Section not found'], 404);
        }

        return response()->json(['data' => $data]);
    }
}
