<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function index(): Response
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /api/',
            'Disallow: /' . config('services.filament.path', 'loops-internal-portal') . '/',
            'Disallow: /storage/',
            '',
            'Sitemap: ' . url('/sitemap.xml'),
        ]);

        return response($content, 200)->header('Content-Type', 'text/plain');
    }
}
