<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $portfolioItems = PortfolioItem::published()
            ->select('slug', 'updated_at')
            ->orderByDesc('updated_at')
            ->get();

        $services = Service::where('published', true)
            ->select('slug', 'updated_at')
            ->get();

        $staticPages = [
            ['loc' => '/',        'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => '/work',    'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/press',   'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/contact', 'priority' => '0.8', 'changefreq' => 'monthly'],
        ];

        $xml = view('sitemap', compact('portfolioItems', 'services', 'staticPages'))->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
