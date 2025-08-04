<?php 
namespace App\Services;

use App\Models\StockMovement;

class StockMovementService
{
    public function createInitialStock(int $productId, int $quantity)
    {
        if ($quantity > 0) {
            return StockMovement::create([
                'product_id' => $productId,
                'type' => 'in',
                'quantity' => $quantity,
                'description' => StockMovement::STOCK_INITIAL,
            ]);
        }

        return null;
    }
}
