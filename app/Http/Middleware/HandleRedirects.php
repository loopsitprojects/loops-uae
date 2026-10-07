<?php

namespace App\Http\Middleware;

use App\Models\Redirect;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleRedirects
{
    public function handle(Request $request, Closure $next): Response
    {
        // Only check non-API, non-admin, non-asset requests
        $path = '/' . ltrim($request->path(), '/');

        if (
            $request->is('api/*') ||
            $request->is('admin*') ||
            $request->is('livewire*') ||
            $request->is('loops-internal-portal*') ||
            $request->is('_debugbar*') ||
            preg_match('/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map)$/', $path)
        ) {
            return $next($request);
        }

        try {
            $redirect = Redirect::findMatch($path);

            if ($redirect) {
                $redirect->incrementHits();
                return redirect($redirect->to_path, $redirect->type);
            }
        } catch (\Throwable $e) {
            // Gracefully catch database/table exceptions to avoid breaking page requests
        }

        return $next($request);
    }
}
