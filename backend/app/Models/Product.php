<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'sku',
        'barcode',
        'price',
        'compare_price',
        'cost',
        'tax_class',
        'track_inventory',
        'stock',
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
        'images'
    ];
    protected $casts = [
        'track_inventory' => 'boolean',
        'allow_backorders' => 'boolean',
        'featured' => 'boolean',
        'images' => 'array',
        'tags' => 'array',
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
