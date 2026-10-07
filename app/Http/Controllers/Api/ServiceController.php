<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::where('published', true)
            ->with('capabilities')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => ServiceResource::collection($services)]);
    }

    public function show(string $slug): ServiceResource|JsonResponse
    {
        $service = Service::where('slug', $slug)
            ->where('published', true)
            ->with(['capabilities', 'media'])
            ->first();

        if (!$service) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return new ServiceResource($service);
    }
}
