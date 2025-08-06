<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        $sku = strtoupper($this->faker->unique()->bothify('SKU-####'));
        return [
            'name' => $name,
            'description' => $this->faker->paragraph(),
            'sku' => $sku,
            'barcode' => $this->faker->ean13(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'compare_price' => $this->faker->randomFloat(2, 1000, 1500),
            'cost' => $this->faker->randomFloat(2, 5, 500),
            'tax_class' => $this->faker->randomElement(['standard', 'reduced', 'none']),
            'track_inventory' => $this->faker->boolean(),          
            'low_stock_threshold' => $this->faker->numberBetween(0, 10),
            'allow_backorders' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'featured' => $this->faker->boolean(),
            'category_id' => Category::inRandomOrder()->first()?->id,
            'brand_id' => Brand::inRandomOrder()->first()?->id,
            'tags' => implode(',', $this->faker->words(3)),
            'weight' => $this->faker->randomFloat(2, 0.1, 5),
            'length' => $this->faker->randomFloat(2, 1, 100),
            'width' => $this->faker->randomFloat(2, 1, 100),
            'height' => $this->faker->randomFloat(2, 1, 100),
            'slug' => \Str::slug($name . '-' . $sku),         
        ];
    }
}
