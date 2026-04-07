<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->get();
        return response()->json($addresses);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'street_and_number' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'references' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        if (isset($validated['is_default']) && $validated['is_default']) {
            // Si la nueva dirección es la predeterminada, desmarcar las otras
            $request->user()->addresses()->update(['is_default' => false]);

        } else {
            // si es la primera dirección, marcarla como predeterminada
            if ($request->user()->addresses()->count() === 0) {
                $validated['is_default'] = true;
            }
        }

        $address = $request->user()->addresses()->create($validated);

        return response()->json($address, 201);
    }



}
