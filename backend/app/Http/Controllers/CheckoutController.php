<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {        
        $request->validate([
            'shipping_address' => 'required|array',
            'payment_method' => 'required|string',       
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->with('items.product')->firstOrFail();

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Carrinho vazio'], 422);
        }

        DB::beginTransaction();

        try {      
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id); 
                if (!$product) {
                    throw new \Exception("Produto não existe: {$item->product_id}");
                }
                if ($product->stock < $item->quantity) {
                    throw new \Exception("Estoque insuficiente para {$product->name}");
                }
                $subtotal += $item->price_at_time * $item->quantity;
            }
     
            $discount = 0;
            $shipping = 0;
            $tax = round(($subtotal - $discount) * 0.08, 2);
            $total = $subtotal - $discount + $shipping + $tax;
     
            $order = Order::create([
                'order_number' => strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'payment_meta' => ['method' => $request->payment_method]
            ]);
    
            foreach ($cart->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,                  
                    'quantity' => $item->quantity,
                    'price' => $item->price_at_time,
                    'subtotal' => $item->price_at_time * $item->quantity
                ]);
         
                $product->stock -= $item->quantity;
                if ($product->stock < 0) {
                    throw new \Exception("Estoque negativo para produto {$product->id}");
                }
                $product->save();
            }       
            $cart->items()->delete();

            DB::commit();
           
            return response()->json(['order' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro no checkout: ' . $e->getMessage()], 422);
        }
    }
}
