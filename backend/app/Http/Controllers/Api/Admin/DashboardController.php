<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total');
        $pendingOrders = Order::where('status', 'pending')->count();
        
        $lowStockProducts = Product::where('stock', '<=', 10)
                                    ->select('id', 'name', 'sku', 'stock', 'image_url')
                                    ->orderBy('stock', 'asc')
                                    ->get();

        // NUEVO: Agrupamos las ventas de los últimos 7 días
        $salesChart = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as daily_total')
            )
            ->where('status', '!=', 'cancelled')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    // Formateamos la fecha para que diga "15 Abr"
                    'name' => Carbon::parse($item->date)->isoFormat('D MMM'), 
                    'total' => (float) $item->daily_total
                ];
            });

        return response()->json([
            'revenue' => $totalRevenue,
            'pending_orders' => $pendingOrders,
            'low_stock_products' => $lowStockProducts,
            'sales_chart' => $salesChart // Enviamos la gráfica a React
        ]);
    }
}