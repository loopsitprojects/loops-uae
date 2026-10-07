<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'livewire/*',
        'livewire/update',
        '*/livewire/*',
        '*/livewire/update',
        'admin/livewire/*',
        'admin/login',
        'admin/*',
        'loops-internal-portal/*',
        'loops-internal-portal/login',
        'api/*',
    ];
}
