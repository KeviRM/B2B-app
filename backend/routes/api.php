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
    Route::post('/orders/calculate', [OrderController::class, 'calculate']);

    Route::post('/orders', [OrderController::class, 'store']);

});


