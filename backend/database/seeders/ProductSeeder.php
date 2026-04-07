<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category; 

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Creamos algunas categorías de prueba para tu B2B
        $categoriaSalsas = Category::create(['name' => 'Salsas Artesanales', 'slug' => 'salsas-artesanales']);
        $categoriaPan = Category::create(['name' => 'Pan Artesanal', 'slug' => 'pan-artesanal']);
        

        $pan1 = Product::create([
            'category_id' => $categoriaPan->id, // <-- Asignamos la categoría
            'sku' => 'PAL-PAN-250',
            'name' => 'Pan Artesanal "Pa\' Llevar" 250g',
            'description' => 'Pan artesanal hecho con ingredientes naturales. Ideal para acompañar tus comidas.',
            'price' => 50.00,
            'stock' => 200,
            'is_active' => true,
        ]);
        $pan1->tiers()->createMany([
            ['min_quantity' => 12, 'price' => 45.00],
            ['min_quantity' => 24, 'price' => 40.00],
        ]);
        
        // 2. SALSA ROJO BRAVO
        $rojoBravo = Product::create([
            'category_id' => $categoriaSalsas->id, // <-- Asignamos la categoría
            'sku' => 'PAL-ROJO-250',
            'name' => 'Salsa Macha Rojo Bravo "Pa\' Llevar" 250g',
            'description' => 'Salsa macha artesanal hecha con aceite de oliva, almendras y chiles seleccionados. Ideal para tacos y carnes.',
            'price' => 120.00,
            'stock' => 500,
            'is_active' => true,
        ]);
        $rojoBravo->tiers()->createMany([
            ['min_quantity' => 12, 'price' => 100.00],
            ['min_quantity' => 24, 'price' => 85.00],
        ]);

        // 3. SALSA CHIPOTLE DULCE
        $chipotleDulce = Product::create([
            'category_id' => $categoriaSalsas->id, // <-- Asignamos la categoría
            'sku' => 'PAL-CHIDUL-250',
            'name' => 'Salsa Macha Chipotle Dulce "Pa\' Llevar" 250g',
            'description' => 'El toque perfecto entre picante y dulce. Hecha con aceite de oliva y almendras. Ideal para botanas.',
            'price' => 125.00,
            'stock' => 300,
            'is_active' => true,
        ]);
        $chipotleDulce->tiers()->createMany([
            ['min_quantity' => 12, 'price' => 105.00],
            ['min_quantity' => 24, 'price' => 90.00],
        ]);

        // 4. SALSA CHIPOTLE BRIO
        $chipotleBrio = Product::create([
            'category_id' => $categoriaSalsas->id, // <-- Asignamos la categoría
            'sku' => 'PAL-CHIBRI-250',
            'name' => 'Salsa Macha Chipotle Brio "Pa\' Llevar" 250g',
            'description' => 'Sabor ahumado y vibrante para paladares exigentes. Ideal para mariscos y cortes.',
            'price' => 130.00,
            'stock' => 450,
            'is_active' => true,
        ]);
        $chipotleBrio->tiers()->createMany([
            ['min_quantity' => 12, 'price' => 110.00],
            ['min_quantity' => 24, 'price' => 95.00],
        ]);
    }
}