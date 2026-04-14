<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use App\Models\ProductTier;

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;


use Barryvdh\DomPDF\Facade\Pdf;


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
            
            $priceToUse = $product->price; 
            $applicableTier = ProductTier::where('product_id', $product->id)
                ->where('min_quantity', '<=', $item['quantity'])
                ->orderBy('min_quantity', 'desc') 
                ->first();

            if ($applicableTier) {
                $priceToUse = $applicableTier->price;
            }
            
            $subtotal += ($priceToUse * $item['quantity']);
        }
        $freeShippingThreshold = 2000;
        $baseShippingCost = 150;
        $discountShippingCost = 50; 
        $shippingCost = $subtotal >= $freeShippingThreshold ? $discountShippingCost : $baseShippingCost;
        $total = $subtotal + $shippingCost;

        return response()->json([
            'subtotal' => round($subtotal, 2),
            'shipping' => round($shippingCost, 2),
            'total' => round($total, 2),
        ]);
    }


    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with([
                'items.product.tiers', 
                'address'        
            ])
            ->latest() 
            ->get();

        return response()->json($orders);
    }


    public function show($id, Request $request)
    {
        $user = $request->user();

        $order = Order::with(['items.product.tiers', 'address'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }
        



        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'mp_payment_data' => 'nullable|array', // Para datos específicos de Mercado Pago
        ]);

        $user = $request->user();
        
        $subtotal = 0;
        $orderItemsData = [];

        foreach ($request->items as $item) {
            $product = Product::find($item['id']);
            
            $priceToUse = $product->price; 

            // 2. Buscamos el tier dinámico
            $applicableTier = ProductTier::where('product_id', $product->id)
                ->where('min_quantity', '<=', $item['quantity'])
                ->orderBy('min_quantity', 'desc')
                ->first();

            if ($applicableTier) {
                $priceToUse = $applicableTier->price;
            }
            
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

            if ($request->payment_method === 'tarjeta' && $request->mp_payment_data) {

                MercadoPagoConfig::setAccessToken(env('MP_ACCESS_TOKEN'));

                $client = new PaymentClient();

                $payment = $client->create([
                    "transaction_amount" => (float) $total,
                    "token" => $request->mp_payment_data['token'],
                    "description" => "Pedido Mayoreo B2B - " . $user->name,
                    "installments" => $request->mp_payment_data['installments'],
                    "payment_method_id" => $request->mp_payment_data['payment_method_id'],
                    "issuer_id" => $request->mp_payment_data['issuer_id'],
                    "payer" => [
                        "email" => $user->email,
                    ]
                ]);



                if ($payment->status !== 'approved') {
                     throw new \Exception('El pago fue rechazado. Estado: ' . $payment->status_detail);

                }

                $order->status = 'paid';
                $order->payment_id = $payment->id;
                $order->save();
                
            }

            DB::commit();

            return response()->json([
                'message' => 'Pedido pagado y creado exitosamente',
                'order_id' => $order->id,
                'total' => $total
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al procesar el pago', 
                'error' => $e->getMessage()
            ], 422);
        }
    }





    public function downloadTicket(Request $request, $id)
    {
        $user = $request->user();

        $order = Order::with(['items.product', 'address'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $storeData = [
            'name' => 'Pa LLevar',
            'address' => 'Av. Principal 123, Centro, Apizaco, Tlaxcala',
            'phone' => '+52 241 000 0000',
            'email' => 'pallevar@gmail.com'
        ];

        // Genera el PDF usando la vista y datos
        $pdf = Pdf::loadView('pdf.ticket', compact('order', 'storeData'));

        // Retornamos el archivo para su descarga
        return $pdf->download("Ticket_PED-000{$order->id}.pdf");
    }
}