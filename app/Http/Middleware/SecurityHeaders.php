<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

        // HSTS — only on production (not local dev)
        if (app()->isProduction()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        // Content Security Policy — permissive for dev, strict for prod
        if (app()->isProduction()) {
            $response->headers->set('Content-Security-Policy',
                "default-src 'self'; " .
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net; " .
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com https://cdn.fontshare.com https://fonts.bunny.net; " .
                "font-src 'self' https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com https://fonts.bunny.net data:; " .
                "img-src 'self' data: blob: https: https://logo.clearbit.com; " .
                "connect-src 'self' https: https://www.google-analytics.com; " .
                "media-src 'self' blob: https: https://ai.loopsintegrated.co; " .
                "frame-src 'self' https:; " .
                "object-src 'none'; " .
                "base-uri 'self'; " .
                "form-action 'self';"
            );
        }

        return $response;
    }
}
