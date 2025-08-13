<?php

namespace App\Jobs;

use App\Models\CartItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesAndRestoresModelIdentifiers;

class UpdateCartItemQuantity implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesAndRestoresModelIdentifiers;

    protected $cartId;
    protected $productId;
    protected $quantity;

    public function __construct($cartId, $productId, $quantity)
    {
        $this->cartId = $cartId;
        $this->productId = $productId;
        $this->quantity = $quantity;
    }

    public function handle()
    {   
        \Log::info('Fila funcionando! ' . now());
        CartItem::updateOrCreate(
            [
                'cart_id' => $this->cartId,
                'product_id' => $this->productId,
            ],
            [
                'quantity' => $this->quantity
            ]
        );
    }
}
