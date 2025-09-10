<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AvailabilityRuleController;
use App\Http\Controllers\AvailabilitySlotController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ShippingMethodController;
use App\Http\Controllers\SlotController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('check-auth', [AuthController::class, 'checkAuth']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    //user
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('me/update', [UserController::class, 'updateProfile']);
    Route::get('me', [UserController::class, 'me']);

    //Brands
    Route::apiResource('brands', BrandController::class);

    //tags
    Route::apiResource('tags', TagController::class);

    //stock movements
    Route::apiResource('stock', StockMovementController::class);
    Route::get('/stock/{id}/movements', [StockMovementController::class, 'movements']);
    Route::get('/stock-movements/product/{id}', [StockMovementController::class, 'movementsByType']);

    //products
    Route::apiResource('product', ProductController::class)->except(['index']);

    //rules
    Route::prefix('availability-rules')->group(function () {
        Route::get('/{serviceId}', [AvailabilityRuleController::class, 'index']);
        Route::post('/', [AvailabilityRuleController::class, 'store']);
        Route::put('/{id}', [AvailabilityRuleController::class, 'update']);
        Route::delete('/{id}', [AvailabilityRuleController::class, 'destroy']);
    });

    //generate-slots    
    Route::post('/generate-slots', [SlotController::class, 'generateSlot']);
    Route::patch('/slots/{id}/toggle', [SlotController::class, 'toggleSlot']);
    Route::get('/availability', [AvailabilitySlotController::class, 'index']);

    //calendario
    Route::prefix('calendar')->group(function () {
        Route::get('/slots', [CalendarController::class, 'getSlots']);
        Route::post('/book-by-admin', [CalendarController::class, 'bookSlotByAdmin']);
        Route::post('/block', [CalendarController::class, 'blockSlot']);
        Route::post('/unblock', [CalendarController::class, 'unblockSlot']);
    });

    //appointments
    Route::apiResource('appointments', AppointmentController::class);
    Route::patch('appointments/{id}/status', [AppointmentController::class, 'updateStatus']);


    //address
    Route::apiResource('address', AddressController::class);

    //customers
    Route::apiResource('customer', CustomerController::class);

    //supplier
    Route::apiResource('suppliers', SupplierController::class);

    //image
    Route::delete('images/{id}', [ProductImageController::class, 'destroy']);
    Route::post('uploads/temp-images', [ProductImageController::class, 'uploadTempImages']);
    Route::delete('delete-temp-image', [ProductImageController::class, 'deleteTemp']);
    Route::put('/image/{id}/main-image', [ProductImageController::class, 'setMainImage']);

    //cart
    Route::apiResource('cart', CartController::class);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::patch('/cart/items/{itemId}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem']);
    Route::delete('/cart', [CartController::class, 'clear']);

    //checkout
    Route::post('/checkout', [CheckoutController::class, 'checkout']);

    //shipping methods
    Route::apiResource('shipping-methods', ShippingMethodController::class);

    //oders
    Route::apiResource('orders', OrderController::class);
    Route::get('orders/user/{id}', [OrderController::class, 'userOrders']);

    //notifications
    Route::apiResource('/notifications', NotificationController::class);
});

//category
Route::apiResource('category', CategoryController::class);
Route::get('categories/featured', [CategoryController::class, 'categoriesFeatured']);

//service
Route::apiResource('service', ServiceController::class);
Route::get('/services', [ServiceController::class, 'index']);

// product
Route::get('product', [ProductController::class, 'index']);
Route::get('products/featured', [ProductController::class, 'productsFeatured']);
Route::get('product-detail/{slug}', [ProductController::class, 'showBySlug']);

//imagens
Route::prefix('products/{product}')->group(function () {
    Route::get('images', [ProductImageController::class, 'index']);
    Route::post('images', [ProductImageController::class, 'store']);
});
