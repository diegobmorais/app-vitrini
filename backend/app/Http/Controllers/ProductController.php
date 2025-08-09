<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\StockMovementService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $stockMovementService;
    public function __construct(StockMovementService $stockMovementService)
    {
        $this->stockMovementService = $stockMovementService;
    }
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

        $query->with(['category', 'images', 'mainImage', 'stockMovements']);

        $products = $query->get();

        $products = $products->map(function ($product) {
            $product->current_stock = $product->stock;
            return $product;
        });

        //filtro por estoque
        if ($request->filled('stock')) {
            $stockFilter = $request->stock;

            if ($stockFilter === 'in_stock') {
                $products = $products->where('current_stock', '>', 0);
            } elseif ($stockFilter === 'low_stock') {
                $products = $products->filter(function ($product) {
                    return $product->current_stock > 0 && $product->current_stock <= $product->low_stock_threshold;
                });
            } elseif ($stockFilter === 'out_of_stock') {
                $products = $products->where('current_stock', 0);
            }
        }
        // Ordenação     
        if ($request->filled('sort')) {
            $products = $products->sortBy([
                $this->getSortField($request->sort),
                $this->getSortDirection($request->sort)
            ]);
        }

        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);
        $total = $products->count();

        $items = $products
            ->skip(($currentPage - 1) * $perPage)
            ->take($perPage)
            ->values();

        //resposta paginada
        $paginated = new LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginated);
    }
    private function getSortField($sort)
    {
        return match ($sort) {
            'name_asc', 'name_desc' => 'name',
            'price_asc', 'price_desc' => 'price',
            'stock_asc', 'stock_desc' => 'current_stock',
            'created_at_asc', 'created_at_desc' => 'created_at',
            default => 'name'
        };
    }

    private function getSortDirection($sort)
    {
        return match ($sort) {
            'name_desc', 'price_desc', 'stock_desc', 'created_at_desc' => 'desc',
            default => 'asc'
        };
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

            $initialStock = $data['stock'] ?? 1;
            unset($data['stock']);

            $data['low_stock_threshold'] = $request->low_stock_threshold ?? 1;

            $product = Product::create($data);

            $this->stockMovementService->createInitialStock($product->id, $initialStock);

            app(ProductImageController::class)->moveImagesFromTemp($request->input('upload_session_id'), $product);

            return response()->json([
                'message' => 'Product created sucessfully',
                'data' => $product
            ], 201);
        } else {
            return response()->json(['Unauthorized'], 404);
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

            app(ProductImageController::class)->moveImagesFromTemp($request->input('upload_session_id'), $product);

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
        $product = Product::with('images')
            ->where('slug', $slug)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Produto não encontrado.'], 404);
        }
       
        return response()->json($product);
    }
}
