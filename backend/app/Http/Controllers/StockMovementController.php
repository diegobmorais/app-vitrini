<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')
            ->select('id', 'name', 'sku', 'category_id', 'low_stock_threshold', 'status')
            ->get();

        $products->transform(function ($product) {
            $product->current_stock = $product->stock;
            $product->last_movement = $product->stockMovements->sortByDesc('created_at')->first()?->created_at;
            return $product;
        });

        return response()->json([
            'products' => $products,
            'metrics' => [
                'total' => Product::count(),
                'in_stock' => $products->where('current_stock', '>', 0)->count(),
                'low_stock' => $products->where('current_stock', '>', 0)->where('current_stock', '<=', 'low_stock_threshold')->count(),
                'out_of_stock' => $products->where('current_stock', 0)->count(),
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
