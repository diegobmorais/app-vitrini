<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category', 'stockMovements')
            ->select('id', 'name', 'sku', 'category_id', 'low_stock_threshold', 'status');


        $allProductsRaw = Product::with('stockMovements')->get();

        $allProducts = $allProductsRaw->map(function ($product) {
            $product->current_stock = $product->stock;
            return $product;
        });

        $inStock = $allProducts->filter(fn($p) => $p->current_stock > 0);
        $outOfStock = $allProducts->filter(fn($p) => $p->current_stock === 0);
        $lowStock = $allProducts->filter(fn($p) => $p->current_stock <= $p->low_stock_threshold);

        // Filtros de busca
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%");
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->paginate(10);

        $products->getCollection()->transform(function ($product) {
            //  `getStockAttribute` já calcula 
            $product->current_stock = $product->stock;
            $product->last_movement = $product->stockMovements
                ->sortByDesc('created_at')
                ->first()?->created_at;

            return $product;
        });
       
        // Filtro por tipo de estoque (pós-cálculo)
        if ($request->filled('stock')) {
            $stockFilter = $request->stock;

            if ($stockFilter === 'low') {
                $filteredCollection = $lowStock;
            } elseif ($stockFilter === 'out') {
                $filteredCollection = $outOfStock;
            } else {
                $filteredCollection = $inStock;
            }

            $products = new LengthAwarePaginator(
                $filteredCollection,
                $filteredCollection->count(),
                $products->perPage(),
                $products->currentPage(),
                ['path' => $request->url()]
            );
        }

        return response()->json([
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'has_more_pages' => $products->hasMorePages(),
            ],
            'metrics' => [
                'total' => $allProducts->count(),
                'in_stock' => $inStock->count(),
                'low_stock' => $lowStock->count(),
                'out_of_stock' => $outOfStock->count(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string|max:255',
        ]);

        $movement = StockMovement::create($data);

        return response()->json([
            'message' => 'Movimentação registrada',
            'movement' => $movement
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(StockMovement $stockMovement)
    {
        return response()->json($stockMovement->load(['product']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockMovement $stockMovement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockMovement $stockMovement)
    {
        $stockMovement->delete();

        return response()->json(['message' => 'Stock movement deleted']);
    }
}
