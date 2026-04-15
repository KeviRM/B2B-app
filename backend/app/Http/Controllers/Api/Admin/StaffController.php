<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::with('roles')->whereHas('roles')->get();
        $roles = Role::all();

        return response()->json([
            'staff' => $staff,
            'roles' => $roles
        ]);
    }

    //  Crear un nuevo trabajador
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Le asignamos el puesto
        $user->assignRole($request->role);

        return response()->json(['message' => 'Trabajador registrado con éxito', 'user' => $user->load('roles')]);
    }

    //  Eliminar a un trabajador 
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Evitar que el Super Admin se borre a sí mismo por accidente
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Trabajador eliminado correctamente']);
    }
}