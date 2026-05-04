<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Limpia el caché de Spatie físicamente
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Forzamos el 'guard' a web (el predeterminado de Sanctum/SPA)
        $guard = 'web'; 

        /// 1. CREAR PERMISOS ///
        $permisos = [
            'ver_ordenes', 'editar_ordenes', 'eliminar_ordenes',
            'ver_catalogo', 'crear_productos', 'editar_productos', 'gestionar_tiers',
            'ver_personal', 'gestionar_personal'
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso, 'guard_name' => $guard]);
        }

        /// 2. CREAR ROLES Y ASIGNAR ///

        // Rol: Almacén
        $roleAlmacen = Role::firstOrCreate(['name' => 'Almacén', 'guard_name' => $guard]);
        $roleAlmacen->syncPermissions(['ver_ordenes']);

        // Rol: Ventas
        $roleVentas = Role::firstOrCreate(['name' => 'Ventas', 'guard_name' => $guard]);
        $roleVentas->syncPermissions(['ver_ordenes', 'editar_ordenes', 'ver_catalogo']);

        // Rol: Gerente de Catálogo
        $roleCatalogo = Role::firstOrCreate(['name' => 'Gerente de Catálogo', 'guard_name' => $guard]);
        $roleCatalogo->syncPermissions(['ver_catalogo', 'crear_productos', 'editar_productos', 'gestionar_tiers']);

        // Rol: Super Admin
        $roleAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => $guard]);
        $roleAdmin->syncPermissions(Permission::all());
    }
}