<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    //  Obtener todo el catálogo con sus reglas de precio
    public function index()
    {
        $products = Product::with('tiers')->latest()->get();
        return response()->json($products);
    }

    //  Crear un nuevo producto con sus Tiers de mayoreo
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
            'tiers' => 'nullable|array'
        ]);

        DB::beginTransaction();
        try {

            $imagePath = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $imagePath = asset('storage/' . $path); // Genera la URL pública
            }

            $product = Product::create([
                'category_id' => $request->category_id ?? 1, 
                'name' => $request->name,
                'sku' => $request->sku,
                'price' => $request->price,
                'stock' => $request->stock,
                'description' => $request->description,
                'image_url' => $imagePath,
                'bulk_price' => $request->price 
            ]);

            // Se guarda las reglas de mayoreo
            if ($request->tiers) {
                foreach ($request->tiers as $tier) {
                    $product->tiers()->create($tier);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Producto creado', 'product' => $product->load('tiers')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar', 'error' => $e->getMessage()], 422);
        }
    }

    // Actualizar producto y reemplazar sus Tiers
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
            'tiers' => 'nullable|array'
            
        ]);

        DB::beginTransaction();
        try {
            $dataToUpdate = $request->only(['name', 'sku', 'price', 'stock', 'description', 'category_id']);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $dataToUpdate['image_url'] = asset('storage/' . $path);
            }

            $product->update($dataToUpdate);

            if ($request->has('tiers')) {
                $product->tiers()->delete();
                foreach ($request->tiers as $tier) {
                    $product->tiers()->create($tier);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Producto actualizado', 'product' => $product->load('tiers')]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar', 'error' => $e->getMessage()], 422);
        }
    }

    //  Eliminar producto
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Producto eliminado del catálogo']);
    }
}