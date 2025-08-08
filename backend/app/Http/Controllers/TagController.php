<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()) {
            $tags = Tag::all();
            return response()->json($tags, 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()) {
            $request->validate([
                'name' => 'required'
            ]);
            $tag = Tag::create($request->all());

            return response()->json(['message' => 'Tag created successfully.', 'tag' => $tag], 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (Auth::user()) {
            $tag = Tag::find($id);

            return response()->json($tag, 200);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (Auth::user()) {
            $request->validate([
                'name' => 'required'
            ]);
            $tag = Tag::find($id);
            $tag->update($request->all());

            return response()->json(['message' => 'Tag updated successfully.', 'tag' => $tag], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (Auth::user()) {
            $tag = Tag::find($id);
            $tag->delete();

            return response()->json(['message' => 'Tag deleted successfully.'], 204);
        }
    }
}
