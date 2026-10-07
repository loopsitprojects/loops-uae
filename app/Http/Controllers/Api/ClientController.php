<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::where('published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'id'       => $c->id,
                'name'     => $c->name,
                'logo_url' => $c->logo_url,
                'url'      => $c->url,
            ]);

        return response()->json(['data' => $clients]);
    }
}
