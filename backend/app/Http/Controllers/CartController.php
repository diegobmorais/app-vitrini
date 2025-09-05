<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\UpdateCartItemQuantity;
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

        // Busca ou cria o carrinho
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.product');

        return response()->json($this->formatCartResponse($cart), 200);
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

        // Verifica se o item já existe no carrinho
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($item) {
            // Atualiza a quantidade
            $item->quantity += $qty;
            $item->save();
        } else {
            // Cria um novo item
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $qty,
                'price_at_time' => $product->price
            ]);
        }

        $cart->load('items.product');

        return response()->json($this->formatCartResponse($cart), 201);
    }

    /**
     * Formata o JSON de resposta do carrinho
     */
    private function formatCartResponse($cart)
    {   
        $items = [];
        $subtotal = 0;
        $discount = 0;
        $shipping = 0;

        foreach ($cart->items as $item) {
            $price = (float) $item->product->price;
            $qty = $item->quantity;
            $itemDiscount = $item->product->discount ?? 0;

            $items[] = [
                'cart_item_id' => $item->id,
                'id' => $item->product->id,
                'name' => $item->product->name,
                'price' => $price,
                'image' => $item->product->main_image ?? '/images/placeholder.jpg',
                'quantity' => $qty,
                'stock' => $item->product->stock,
                'discount' => $itemDiscount
            ];
     
            $subtotal += $price * $qty;
       
            if ($itemDiscount > 0) {
                $discount += ($price * $itemDiscount / 100) * $qty;
            }
        }

        $total = $subtotal - $discount + $shipping;

        return [
            'items' => $items,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'total' => $total
        ];
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
        
        UpdateCartItemQuantity::dispatch($cart->id, $product->id, $request->quantity);
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
