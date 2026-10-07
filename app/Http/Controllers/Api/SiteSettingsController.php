<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;

class SiteSettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = PageSection::getForPage('global');

        return response()->json(['data' => $settings]);
    }
}
