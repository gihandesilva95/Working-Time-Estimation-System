<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:PM')->group(function () {
        Route::post('/tasks', [TaskController::class, 'assignTask']);
        Route::post('/tasks/{id}/calculate', [TaskController::class, 'calculateEndTime']);
        Route::get('/settings', [SettingController::class, 'getSettings']);
        Route::post('/settings', [SettingController::class, 'updateSettings']);
        Route::post('/holidays', [SettingController::class, 'addHoliday']);
        Route::delete('/holidays/{id}', [SettingController::class, 'deleteHoliday']);

        Route::get('/engineers', function () {
            return \App\Models\User::where('role', 'Engineer')->get();
        });
    });

    Route::middleware('role:Engineer')->group(function () {
        Route::post('/tasks/{id}/estimate', [TaskController::class, 'submitEstimate']);
    });

    Route::get('/tasks', [TaskController::class, 'listTasks']);
});
