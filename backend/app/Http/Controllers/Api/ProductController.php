<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('tiers')
        ->where('is_active', true)
        ->get();
        return response()->json($products);
    }
}
