<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Limpia el caché de Spatie para evitar errores
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        ///CREAR PERMISOS//

        // Órdenes
        Permission::create(['name' => 'ver_ordenes']);
        Permission::create(['name' => 'editar_ordenes']);
        Permission::create(['name' => 'eliminar_ordenes']);
        
        // Catálogo
        Permission::create(['name' => 'ver_catalogo']);
        Permission::create(['name' => 'crear_productos']);
        Permission::create(['name' => 'editar_productos']);
        Permission::create(['name' => 'gestionar_tiers']);

        // Personal
        Permission::create(['name' => 'ver_personal']);
        Permission::create(['name' => 'gestionar_personal']);

        // CREAR ROLES Y ASIGNAR PERMISOS 
        
        // Rol: Almacén 
        $roleAlmacen = Role::create(['name' => 'Almacén']);
        $roleAlmacen->givePermissionTo('ver_ordenes');

        // Rol: Ventas 
        $roleVentas = Role::create(['name' => 'Ventas']);
        $roleVentas->givePermissionTo([
            'ver_ordenes',
            'editar_ordenes',
            'ver_catalogo'
        ]);

        // Rol: Gerente de Catálogo 
        $roleCatalogo = Role::create(['name' => 'Gerente de Catálogo']);
        $roleCatalogo->givePermissionTo([
            'ver_catalogo',
            'crear_productos',
            'editar_productos',
            'gestionar_tiers'
        ]);

        // Rol: Super Admin
        $roleAdmin = Role::create(['name' => 'Super Admin']);
        $roleAdmin->givePermissionTo(Permission::all());
    }
}