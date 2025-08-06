<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        foreach (range(1, 10) as $i) {
            $name = $faker->unique()->words(3, true);

            Service::create([
                'name' => $name,
                'description' => $faker->sentence(10),
                'price' => $faker->randomFloat(2, 50, 1000),
                'category_id' => rand(1, 9), 
                'slug' => \Str::slug($name),
                'images' => json_encode([
                    $faker->imageUrl(640, 480, 'services', true),
                    $faker->imageUrl(640, 480, 'services', true),
                ]),
            ]);
        }
    }
}
