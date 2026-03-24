<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MembreController;
use App\Http\Controllers\Api\OperationController;
use App\Http\Controllers\Api\TypeOperationController;
use App\Http\Controllers\Api\CotisationController;
use Illuminate\Support\Facades\Route;

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/cotisations', [CotisationController::class, 'suivi']);
    
    // Dashboard
    Route::get('/dashboard/statistiques', [DashboardController::class, 'statistiques']);
    Route::get('/dashboard/solde', [DashboardController::class, 'solde']);

    // Membres
    Route::get('/me', [MembreController::class, 'me']); // AVANT apiResource
    Route::apiResource('membres', MembreController::class);

    // Opérations
    Route::apiResource('operations', OperationController::class);

    // Types d'opérations
    Route::get('/type-operations', [TypeOperationController::class, 'index']);
    Route::get('/type-operations/{typeOperation}', [TypeOperationController::class, 'show']);
    Route::get('/type-operations/categorie/{category}', [TypeOperationController::class, 'byCategory']);
    Route::get('/type-operations/type/{type}', [TypeOperationController::class, 'bytype']);
    
    // Routes admin
    Route::middleware('can:admin')->group(function () {
        Route::post('/type-operations', [TypeOperationController::class, 'store']);
        Route::put('/type-operations/{typeOperation}', [TypeOperationController::class, 'update']);
        Route::delete('/type-operations/{typeOperation}', [TypeOperationController::class, 'destroy']);
    });
    
    Route::get('/test-me', function () {
    return response()->json(['message' => 'OK']);
});
});