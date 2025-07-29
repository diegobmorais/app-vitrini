<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Filtro por categoria
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filtro de busca por nome ou SKU
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        // Filtro por preço
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Ordenação
        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'stock_asc':
                    $query->orderBy('stock', 'asc');
                    break;
                case 'stock_desc':
                    $query->orderBy('stock', 'desc');
                    break;
                case 'created_at_desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'created_at_asc':
                    $query->orderBy('created_at', 'asc');
                    break;
                default:
                    $query->orderBy('name');
            }
        }
        // Paginação
        $perPage = $request->input('per_page', 10);
        $products = $query->with(['category', 'images'])
            ->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        if (Auth::user()) {
            $data = $request->validated();

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }
            $data['tags'] = $request->tags;

            $uploadSessionId = $request->input('upload_session_id');
           
            $product = Product::create($data);

            if ($uploadSessionId) {
                $tempPath = "public/temp/$uploadSessionId";
               
                $files = Storage::disk('public')->files("temp/$uploadSessionId");

                $imageRecords = [];

                foreach ($files as $file) {                    
                    $newPath = str_replace("temp/$uploadSessionId", "products/{$product->id}", $file);
                    Storage::disk('public')->move($file, $newPath);

                    $imageRecords[] = [
                        'url' => Storage::url($newPath),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }                
                $product->images()->createMany($imageRecords);
             
                Storage::deleteDirectory($tempPath);
            }

            return response()->json([
                'message' => 'Product created sucessfully',
                'data' => $product
            ], 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::find($id);
        return $product;
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductRequest $request, Product $product)
    {
        if (Auth::check()) {

            $data = $request->validated();

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $product->update($data);

            return response()->json([
                'message' => 'Product updated sucessfully',
                'data' => $product
            ], 200);
        }
        return response()->json(['message' => 'unauthorized.'], 401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (Auth::check()) {
            $product = Product::find($id);

            if ($product) {
                $product->delete();
                return response()->json([
                    'message' => 'Product deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Product not found'
                ], 404);
            }
        }
    }
    public function productsFeatured()
    {
        $products = Product::with('images')->where('featured', true)->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
    public function showBySlug($slug)
    {
        $product = Product::with('images')->where('slug', $slug)->first();

        if (!$product) {
            return response()->json(['message' => 'Produto não encontrado.'], 404);
        }

        return response()->json($product);
    }
}
