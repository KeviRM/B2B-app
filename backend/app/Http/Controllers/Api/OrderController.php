<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class OrderController extends Controller
{
  

public function calculate(Request $request)
{
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $subtotal = 0;
        $items = $request->items;

        foreach ($items as $item) {
            $product = Product::find($item['id']);
            
            $priceToUse = $product->bulk_price ? $product->bulk_price : $product->price;
            
            $subtotal += ($priceToUse * $item['quantity']);
        }

        // Reglas de negocio centralizadas en el Backend
        // (En el futuro, estos valores podrían venir de una tabla 'settings' en la BD)
        $freeShippingThreshold = 2000;
        $baseShippingCost = 150;

        $shipping = $subtotal >= $freeShippingThreshold ? 0 : $baseShippingCost;
        $total = $subtotal + $shipping;

        // Devolvemos la fuente de la verdad al Frontend
        return response()->json([
            'subtotal' => round($subtotal, 2),
            'shipping' => round($shipping, 2),
            'total' => round($total, 2),
        ]);
    }
}


