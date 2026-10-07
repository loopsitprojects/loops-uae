<?php

use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/robots.txt', [RobotsController::class, 'index']);

// SPA catch-all — serves React frontend with server-side media preloading for fast image/video loading
Route::get('/{any}', function () {
    $paths = [
        public_path('build/index.html'),
        base_path('build/index.html'),
        base_path('public/build/index.html'),
    ];

    foreach ($paths as $path) {
        if (file_exists($path)) {
            $content = file_get_contents($path);
            $buildUrl = asset('build');
            $content = preg_replace('#(https?://[^/\"]+)?(/loopswebsite)?(/public)?/build#', $buildUrl, $content);

            // Server-Side Media Rendering & Preloading: Inject high-priority image and video preloads into HTML head
            $preloadTags = "\n<!-- Server-Side Media Preload Engine -->\n";
            try {
                if (class_exists(\App\Models\PortfolioItem::class)) {
                    $items = \App\Models\PortfolioItem::where('published', true)
                        ->orderBy('sort_order', 'asc')
                        ->take(12)
                        ->get();

                    foreach ($items as $item) {
                        $imgUrl = $item->thumbnail_url ?? $item->hero_url;
                        if ($imgUrl) {
                            $cleanPath = ltrim(parse_url($imgUrl, PHP_URL_PATH) ?? $imgUrl, '/');
                            $fullUrl = asset($cleanPath);
                            $preloadTags .= '<link rel="preload" as="image" href="' . e($fullUrl) . '" fetchpriority="high" />' . "\n";
                        }
                    }
                }
            } catch (\Throwable $e) {
                // Fallback static campaign images
            }

            // Always ensure primary portfolio campaign assets are preloaded on initial server response
            $staticCampaignImages = [
                'images/yamaha-bg.jpg',
                'images/cool-planet-bg.jpg',
                'images/softlogic-bg.jpg',
                'images/mall-bg.jpg',
                'images/vivya-bg.jpg',
                'images/planatones-bg.jpg',
                'images/mendis-bg.jpg',
                'images/rasamusu-bg.jpg',
            ];

            foreach ($staticCampaignImages as $imgPath) {
                $fullUrl = asset($imgPath);
                if (strpos($preloadTags, $fullUrl) === false) {
                    $preloadTags .= '<link rel="preload" as="image" href="' . e($fullUrl) . '" fetchpriority="high" />' . "\n";
                }
            }

            if ($preloadTags) {
                $content = str_replace('</head>', $preloadTags . '</head>', $content);
            }

            return response($content, 200, ['Content-Type' => 'text/html']);
        }
    }

    return response('Front-end build file not found. Please run npm run build.', 404);
})->where('any', '^(?!api|storage|works|livewire.*|vendor|build|fonts|css|js|images|videos|favicon\.ico|_debugbar|' . preg_quote(config('services.filament.path', 'loops-internal-portal'), '#') . ').*$');
