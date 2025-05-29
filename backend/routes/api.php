<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    //Brands
    Route::apiResource('brand', BrandController::class);
    //category
    Route::apiResource('category', CategoryController::class);
    //products
    Route::apiResource('product', ProductController::class);
    //service
    Route::apiResource('service', ServiceController::class);
    //supplier
    Route::apiResource('supplier', SupplierController::class);
    //warehouse stock
    Route::apiResource('warehouses', WarehouseController::class);
    //stock movements
    Route::apiResource('stock-movements', StockMovementController::class)->except(['update']);
});
