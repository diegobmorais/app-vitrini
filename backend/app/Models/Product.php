<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'main_image_id',
        'name',
        'description',
        'sku',
        'barcode',
        'price',
        'compare_price',
        'cost',
        'tax_class',
        'track_inventory',
        'supplier_id',
        'low_stock_threshold',
        'allow_backorders',
        'status',
        'featured',
        'category_id',
        'brand_id',
        'tags',
        'weight',
        'length',
        'width',
        'height',
        'slug',
    ];
    protected $casts = [
        'track_inventory' => 'boolean',
        'allow_backorders' => 'boolean',
        'featured' => 'boolean',
        'tags' => 'array',
    ];
    protected $appends = ['stock'];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, 'product_id');
    }

    public function getStockAttribute()
    {
        $movements = $this->stockMovements()->get();

        return $movements->sum(function ($movement) {
            return match ($movement->type) {
                'in', 'adjustment' => $movement->quantity,
                'out' => -$movement->quantity,
                default => 0
            };
        });
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function mainImage()
    {
        return $this->belongsTo(ProductImage::class, "main_image_id");
    }
}
