<?php

namespace App\Http;

use Livewire\Mechanisms\HandleRequests\HandleRequests as BaseHandleRequests;

class CustomLivewireHandleRequests extends BaseHandleRequests
{
    public function getUpdateUri()
    {
        $uri = parent::getUpdateUri();

        $appUrl = config('app.url');
        $subfolder = parse_url($appUrl, PHP_URL_PATH);

        if (empty($subfolder) || $subfolder === '/') {
            if (isset($_SERVER['REQUEST_URI'])) {
                $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';
                $parts = array_values(array_filter(explode('/', $uriPath)));
                $filamentPath = config('services.filament.path', 'loops-internal-portal');
                if (!empty($parts[0]) && !str_starts_with($parts[0], 'livewire') && !in_array($parts[0], ['api', 'storage', 'vendor', 'build', 'index.php', 'admin', $filamentPath, 'loops-internal-portal'])) {
                    $subfolder = '/' . $parts[0];
                }
            }
        }

        if (!empty($subfolder) && $subfolder !== '/') {
            $subfolder = '/' . trim($subfolder, '/');
            if (!str_starts_with($uri, $subfolder)) {
                $uri = $subfolder . '/' . ltrim($uri, '/');
            }
        }

        return $uri;
    }
}
