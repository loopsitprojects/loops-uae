<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Office;
use Illuminate\Http\JsonResponse;

class OfficeController extends Controller
{
    public function index(): JsonResponse
    {
        $offices = Office::where('published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($o) => [
                'id'             => $o->id,
                'city'           => $o->city,
                'country'        => $o->country,
                'role'           => $o->role,
                'description'    => $o->description,
                'phone'          => $o->phone,
                'email'          => $o->email,
                'address'        => $o->address,
                'lat'            => $o->lat,
                'lng'            => $o->lng,
                'is_headquarters' => $o->is_headquarters,
                'show_in_footer'  => (bool) ($o->show_in_footer ?? true),
            ]);

        return response()->json(['data' => $offices]);
    }
}
