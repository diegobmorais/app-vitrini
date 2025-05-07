<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()) {
            $brands = Brand::all();

            return response()->json([
                'brands' => $brands
            ], 200);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access Danied']);
        }

        $validatedData = $request->validate([
            'name' => 'required|max:90',
            'slug' => 'nullable|unique:brands,slug',
            'description' => 'required|max:150'
        ]);

        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = \Str::slug($validatedData['name']);
        }

        try {
            $brand = Brand::create($validatedData);
            return response()->json([
                'message' => 'Brand created sucessfully',
                'brand' => $brand
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro creating brand',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        if (Auth::user()) {
            $brand = Brand::find($id);

            if (!$brand) {
                return response()->json([
                    'message' => 'Brand not Found',
                ], 404);
            } else {
                return response()->json([
                    'brand' => $brand
                ], 200);
            }
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        if (!Auth::check() || Auth::user()->role_id !== 1) {
            return response()->json([
                'message' => 'Access Denied. Only admin can update brands.',
            ], 403);
        }

        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'message' => 'Brand not Found',
            ], 404);
        } else {
            $validatedData = $request->validate([
                'name' => 'required|max:90',
                'slug' => 'nullable|unique:brands,slug,' . $brand->id,
                'description' => 'required|max:150'
            ]);
            if (empty($validatedData['slug'])) {
                $validatedData['slug'] = \Str::slug($validatedData['name']);
            }

            $brand->update($validatedData);

            return response()->json([
                'message' => 'brand updated',
                'brand' => $brand
            ], 200);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (!Auth::check() || Auth::user()->role_id !== 1) {
            return response()->json([
                'message' => 'Access Denied. Only admin can delete brands.',
            ], 403);
        }
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'message' => 'Brand not Found',
            ], 404);
        } else {
            $brand->delete();
            return response()->json([
                'message' => 'brand deleted sucessfully'
            ], 200);
        }
    }
}
