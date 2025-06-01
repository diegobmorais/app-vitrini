<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/check-auth', [AuthController::class, 'checkAuth']);        
    });
});