<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order; // <-- IMPORTANTE
use Illuminate\Support\Facades\DB; // <-- IMPORTANTE para las transacciones

class OrderController extends Controller
{
    // ... tu función calculate() se queda aquí arriba ...

    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        
        $subtotal = 0;
        $orderItemsData = [];

        foreach ($request->items as $item) {
            $product = Product::find($item['id']);
            $priceToUse = $product->bulk_price ? $product->bulk_price : $product->price;
            
            $subtotal += ($priceToUse * $item['quantity']);
            
            $orderItemsData[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $priceToUse, 
            ];
        }

        // Tus reglas de negocio
        $freeShippingThreshold = 2000;
        $baseShippingCost = 150;
        $discountShippingCost = 50; 
        $shippingCost = $subtotal >= $freeShippingThreshold ? $discountShippingCost : $baseShippingCost;
        $total = $subtotal + $shippingCost;
)
        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $request->address_id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'status' => 'pending_payment', 
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // --- ESPACIO RESERVADO PARA MERCADO PAGO ---

            DB::commit();

            return response()->json([
                'message' => 'Pedido creado exitosamente',
                'order_id' => $order->id,
                'total' => $total
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el pedido', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
}