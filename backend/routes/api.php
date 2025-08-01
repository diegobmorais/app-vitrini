<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('check-auth', [AuthController::class, 'checkAuth']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    //user
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('me/update', [UserController::class, 'updateProfile']);
    Route::get('me', function () {
        return response()->json([
            'user' => Auth::user()
        ]);
    });
    //Brands
    Route::apiResource('brands', BrandController::class);
    //tags
    Route::apiResource('tags', TagController::class);
    //supplier
    Route::apiResource('suppliers', SupplierController::class);
    //warehouse stock
    Route::apiResource('warehouses', WarehouseController::class);
    //stock movements
    Route::apiResource('stock-movements', StockMovementController::class)->except(['update']);
    //address
    Route::apiResource('address', AddressController::class);
    //customers
    Route::apiResource('customer', CustomerController::class);
    //image
    Route::delete('images/{id}', [ProductImageController::class, 'destroy']);
    Route::post('uploads/temp-images', [ProductImageController::class, 'uploadTempImages']);
    Route::delete('delete-temp-image', [ProductImageController::class, 'deleteTemp']);
    Route::put('/image/{id}/main-image', [ProductImageController::class, 'setMainImage']);
});
//category
Route::apiResource('category', CategoryController::class);
Route::get('categories/featured', [CategoryController::class, 'categoriesFeatured']);
//service
Route::apiResource('service', ServiceController::class);
// product
Route::apiResource('product', ProductController::class);
Route::get('products/featured', [ProductController::class, 'productsFeatured']);
Route::get('product-detail/{slug}', [ProductController::class, 'showBySlug']);

//imagens
Route::prefix('products/{product}')->group(function () {
    Route::get('images', [ProductImageController::class, 'index']);
    Route::post('images', [ProductImageController::class, 'store']);
});
