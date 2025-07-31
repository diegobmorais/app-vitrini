<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Str;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Service::all();
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()) {
            $data = $request->validate([
                'name' => 'required|max:150',
                'description' => 'required|max:250',
                'price' => 'required|numeric',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            ]);

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('services', 'public');
            }

            $service = Service::create($data);

            return response()->json([
                'message' => 'Service created successfully',
                'service' => $service->fresh()->append('image_url')
            ], 200);
        } else {
            return response()->json(['message' => 'server error'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $service = Service::find($id);
        return response()->json($service);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        if (Auth::user()) {
            $data = $request->validate([
                'name' => 'required|max:150',
                'description' => 'required|max:250',
                'price' => 'required|numeric',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            ]);

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            if ($request->hasFile('image')) {
                if ($service->image && Storage::disk('public')->exists($service->image)) {
                    Storage::disk('public')->delete($service->image);
                }

                $data['image'] = $request->file('image')->store('services', 'public');
            }

            $service->update($data);

            return response()->json([
                'message' => 'Service updated sucessfully',
                'service' => $service
            ], 200);
        } else {
            return response()->json(['message' => 'unauthorized'], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (Auth::user()) {
            $service = Service::find($id);
            if ($service) {
                $service->delete();
                return response()->json(['message' => 'service deleted.'], 200);
            } else {
                return response()->json(['message' => 'service not found.'], 404);
            }
        } else {
            return response()->json(['message' => 'unauthorized'], 401);
        }
    }
}
