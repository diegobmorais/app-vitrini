<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
            'discount' => 'nullable|numeric',
            'payment_method' => 'required|string',
            'status' => 'required|string',
            'observation' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price_unit' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $total = collect($data['items'])->sum(function ($item) {
                return $item['price_unit'] * $item['quantity'];
            });

            $order = Order::create([
                ...$data,
                'total' => $total - ($data['discount'] ?? 0),
            ]);

            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price_unit' => $item['price_unit'],
                    'total' => $item['price_unit'] * $item['quantity'],
                ]);            
            }

            OrderStatusLog::create([
                'order_id' => $order->id,
                'status' => $order->status,
                'admin_id' => auth()->id(),
                'changed_at' => now(),
            ]);

            DB::commit();

            return response()->json(['message' => 'Pedido criado com sucesso', 'order' => $order->load('items')], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao criar pedido', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
