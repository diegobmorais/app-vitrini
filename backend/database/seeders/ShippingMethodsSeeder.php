<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('shipping_methods')->insert([
            [
                'name' => 'Entrega Padrão',
                'description' => 'Entrega em 3-5 dias úteis',
                'price' => 15.90,
            ],
            [
                'name' => 'Entrega Expressa',
                'description' => 'Entrega em 1-2 dias úteis',
                'price' => 25.90,
            ],
            [
                'name' => 'Retirada na Loja',
                'description' => 'Retire na loja em até 24h',
                'price' => 0,
            ],
        ]);
    }
}
