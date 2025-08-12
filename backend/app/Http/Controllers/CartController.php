<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.product');
        return response()->json(['cart' => $cart], 200);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'nullable|integer|min:1',           
        ]);

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $product = Product::findOrFail($request->product_id);
        $qty = $request->quantity ?? 1;
      
        if ($product->stock < $qty) {
            return response()->json(['message' => 'Estoque insuficiente'], 422);
        }
    
        $price = $product->price;

        $item = CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $product->id,                
            ],
            [
                'quantity' => \DB::raw("quantity + {$qty}"),
                'price_at_time' => $price
            ]
        );
        
        $cart->load('items.product');

        return response()->json(['cart' => $cart], 201);
    }

    public function updateItem(Request $request, $itemId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $item = $cart->items()->where('id', $itemId)->firstOrFail();

        $product = $item->product;
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Estoque insuficiente'], 422);
        }

        $item->quantity = $request->quantity;
        $item->save();

        $cart->load('items.product');
        return response()->json(['cart' => $cart], 200);
    }

    public function removeItem($itemId)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $item = $cart->items()->where('id', $itemId)->firstOrFail();
        $item->delete();

        $cart->load('items.product');
        return response()->json(['cart' => $cart], 200);
    }

    public function clear()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $cart->items()->delete();
        return response()->json(['message' => 'Carrinho limpo'], 200);
    }
}
