<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:categories']);
        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name)]);
        return response()->json(['message' => 'Categoría creada', 'category' => $category], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $request->validate(['name' => 'required|string|max:255|unique:categories,name,' . $id]);
        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);
        return response()->json(['message' => 'Categoría actualizada', 'category' => $category]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Validación de seguridad: No borrar si tiene productos
        if ($category->products()->count() > 0) {
            return response()->json(['message' => 'No puedes borrar una categoría que ya tiene productos asignados.'], 422);
        }
        
        $category->delete();
        return response()->json(['message' => 'Categoría eliminada']);
    }
}