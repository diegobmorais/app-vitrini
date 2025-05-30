<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'diego',
            'email' => 'diego@teste.com',
            'password' => bcrypt('teste123'),
            'role_id' => 1,
            'address_id' => 1
        ]);
        Brand::factory(10)->create();
        Category::factory(10)->create();
        Product::factory(50)->create();
        $this->call(ServiceSeeder::class);
    }
}
