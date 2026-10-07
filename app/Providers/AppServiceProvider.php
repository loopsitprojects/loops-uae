<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            \Livewire\Mechanisms\HandleRequests\HandleRequests::class,
            \App\Http\CustomLivewireHandleRequests::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        foreach ([
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('framework/cache'),
            storage_path('logs'),
            storage_path('app/livewire-tmp'),
            storage_path('app/public'),
            public_path('storage'),
            public_path('works'),
        ] as $path) {
            if (!is_dir($path)) {
                @mkdir($path, 0777, true);
            }
        }

        // Hostinger Root Symlink Sync: Ensure /works and /storage are accessible whether web root is public_html or public_html/public
        try {
            if (is_dir(public_path('works')) && !file_exists(base_path('works'))) {
                @symlink(public_path('works'), base_path('works'));
            }
            if (is_dir(public_path('storage')) && !file_exists(base_path('storage'))) {
                @symlink(public_path('storage'), base_path('storage'));
            }
        } catch (\Throwable $e) {}

        $appUrl = config('app.url');
        $subfolder = parse_url($appUrl, PHP_URL_PATH);

        if ((empty($subfolder) || $subfolder === '/') && isset($_SERVER['REQUEST_URI'])) {
            $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';
            $segments = array_values(array_filter(explode('/', $uriPath)));
            $firstSegment = $segments[0] ?? null;
            $filamentPath = config('services.filament.path', 'loops-internal-portal');
            if ($firstSegment && !str_starts_with($firstSegment, 'livewire') && !in_array($firstSegment, ['api', 'storage', 'vendor', 'build', 'index.php', 'admin', $filamentPath, 'loops-internal-portal'])) {
                $subfolder = '/' . $firstSegment;
                $isHttps = str_starts_with($appUrl, 'https://') ||
                           (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
                           (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on');
                $scheme = $isHttps ? 'https://' : 'http://';
                $host = $_SERVER['HTTP_HOST'] ?? (parse_url($appUrl, PHP_URL_HOST) ?: 'localhost');
                $appUrl = rtrim($scheme . $host, '/') . $subfolder;
            }
        }

        if (!empty($subfolder) && $subfolder !== '/') {
            \Illuminate\Support\Facades\URL::forceRootUrl($appUrl);
            $_SERVER['SCRIPT_NAME'] = $subfolder . '/index.php';
            if (app()->bound('request')) {
                $req = app('request');
                $req->server->set('SCRIPT_NAME', $subfolder . '/index.php');
                try {
                    $ref = new \ReflectionProperty(\Symfony\Component\HttpFoundation\Request::class, 'baseUrl');
                    $ref->setValue($req, null);
                } catch (\Throwable $e) {}
            }
        }

        if (str_starts_with($appUrl, 'https://') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') || (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \Livewire\Livewire::setUpdateRoute(function ($handle) use (&$subfolder) {
            $prefix = (!empty($subfolder) && $subfolder !== '/') ? rtrim($subfolder, '/') : '';
            $route = \Illuminate\Support\Facades\Route::post('/livewire/update', $handle)
                ->middleware('web');
            if (!empty($prefix)) {
                \Illuminate\Support\Facades\Route::post($prefix . '/livewire/update', $handle)
                    ->middleware('web');
            }
            return $route;
        });

        \Livewire\Livewire::setScriptRoute(function ($handle) use (&$subfolder) {
            $prefix = (!empty($subfolder) && $subfolder !== '/') ? rtrim($subfolder, '/') : '';
            $route = \Illuminate\Support\Facades\Route::get('/livewire/livewire.js', $handle)
                ->middleware('web');
            if (!empty($prefix)) {
                \Illuminate\Support\Facades\Route::get($prefix . '/livewire/livewire.js', $handle)
                    ->middleware('web');
            }
            return $route;
        });
    }
}
