<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::all();
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access Danied'], 403);
        }

        $validateRequest = $request->validate([
            'name' => 'required|max:90',
            'slug' => 'nullable|unique:brands,slug',
            'description' => 'required|max:150'
        ]);

        if (empty($validateRequest['slug'])) {
            $validateRequest['slug'] = \Str::slug($validateRequest['name']);
        }

        try {
            $category = Category::create($validateRequest);
            return response()->json([
                "message" => "Category created successfully",
                "category" => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Error",
                "error" => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        if (Auth::user()) {
            $category = Category::find($id);
            if ($category) {
                return response()->json([
                    'category' => $category
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Category not found'
                ], 404);
            }
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access Danied'], 403);
        }

        $category = Category::find($id);

        $validateRequest = $request->validate([
            'name' => 'required|max:90',
            'slug' => 'nullable|unique:category,slug,' . $category->id,
            'description' => 'required|max:150'
        ]);

        if (empty($validateRequest['slug'])) {
            $validateRequest['slug'] = \Str::slug($validateRequest['name']);
        }

        try {
            $category->update($validateRequest);
            return response()->json([
                "message" => "Category updated successfully",
                "category" => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Error",
                "error" => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (!Auth::check() || Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access Danied'], 403);
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        } else {
            $category->delete();
            return response()->json([
                'message' => 'Category deleted successfully'
            ], 200);
        }
    }
}
