<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;

use App\Http\Controllers\Api\OrderController;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AddressController;




Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);



##Rutas protegidas por autenticación

Route::middleware('auth:sanctum')->group(function () {


    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);


    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);


    /* Rutas de pedidos */
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']); 
    Route::post('/orders/calculate', [OrderController::class, 'calculate']);

    Route::get('/orders/{id}/ticket', [OrderController::class, 'downloadTicket']);

    Route::post('/orders', [OrderController::class, 'store']);



    // RUTAS DEL PANEL DE ADMINISTRADOR
    Route::prefix('admin')->group(function () {

        
        Route::get('/orders', [\App\Http\Controllers\Api\Admin\OrderController::class, 'index'])
            ->middleware('permission:ver_ordenes');
            
        Route::put('/orders/{id}/status', [\App\Http\Controllers\Api\Admin\OrderController::class, 'updateStatus'])
            ->middleware('permission:editar_ordenes');

        Route::apiResource('staff', \App\Http\Controllers\Api\Admin\StaffController::class)
            ->middleware('permission:gestionar_personal');

         // Rutas del Catálogo
        Route::get('/products', [\App\Http\Controllers\Api\Admin\ProductController::class, 'index'])
            ->middleware('permission:ver_catalogo');
            
        Route::post('/products', [\App\Http\Controllers\Api\Admin\ProductController::class, 'store'])
            ->middleware('permission:crear_productos');
            
        Route::put('/products/{id}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'update'])
            ->middleware('permission:editar_productos');
            
        Route::delete('/products/{id}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'destroy'])
            ->middleware('permission:editar_productos'); 

        // Rutas de Categorías
        Route::apiResource('categories', \App\Http\Controllers\Api\Admin\CategoryController::class)
            ->middleware('permission:editar_productos'); 


        Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index'])
            ->middleware('permission:ver_ordenes|ver_catalogo');
            

    });

    

});


