<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group( function () {  
    Route::post('/logout', [AuthController::class, 'logout']);
    //Brands
    Route::resource('brand', BrandController::class);
    //category
    Route::resource('category', CategoryController::class);
});
