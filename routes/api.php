<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BlogImageController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MainCategoryController;
use App\Http\Controllers\Api\OpeningHourController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

Route::post('admin/login', [AuthController::class, 'login']);

Route::apiResource('main-categories', MainCategoryController::class)->only(['index', 'show']);
Route::apiResource('blogs', BlogController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('settings', SettingController::class)->only(['index', 'show']);
Route::apiResource('opening-hours', OpeningHourController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('admin/logout', [AuthController::class, 'logout']);
    Route::post('blog-images', [BlogImageController::class, 'store']);
    Route::apiResource('main-categories', MainCategoryController::class)->except(['index', 'show']);
    Route::apiResource('blogs', BlogController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('settings', SettingController::class)->except(['index', 'show']);
    Route::apiResource('opening-hours', OpeningHourController::class)->except(['index', 'show']);
});
