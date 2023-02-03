<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\InvestmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:sanctum')->group(function() {
    /*
    * All Users API
    */
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('users/{id}', [AuthController::class, 'setStatus']);
    Route::get('/user', [AuthController::class, 'currentUser']);
    Route::get('/users', [AuthController::class, 'users']);
    
    /*
    * All Expenses API
    */
    Route::post('/add-expense', [ExpenseController::class, 'store']);
    Route::get('/expenses', [ExpenseController::class, 'index']); // over all expenses list
    Route::get('/expenses/{month}/{year}', [ExpenseController::class, 'getExpensesByMonth']); // Get expense by month
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);
    Route::get('/expenses/{id}', [ExpenseController::class, 'show']);

    // put for update compltte expenses 
    // And Patch for update single expenses 

    Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
    Route::patch('/expenses/{id}', [ExpenseController::class, 'update']);   

    /*
    * All Investment API
    */
    Route::post('/add-investment', [InvestmentController::class, 'store']);
    Route::get('/investment', [InvestmentController::class, 'index']); // over all investment list
    Route::get('/investment/{month}/{year}', [InvestmentController::class, 'getInvestmentByMonth']); // Get investment by month
    Route::delete('/investment/{id}', [InvestmentController::class, 'destroy']);
    Route::get('/investment/{id}', [InvestmentController::class, 'show']);

    // put for update compltte expenses 
    // And Patch for update single expenses 

    Route::put('/investment/{id}', [InvestmentController::class, 'update']);
    Route::patch('/investment/{id}', [InvestmentController::class, 'update']);   

    // To get
    // total expense
    // total Investment
    // To pay or To To receive
    Route::get('/monthly-totals/{month}/{year}', [AuthController::class, 'monthlyTotals']);

});

Route::post('/login', [AuthController::class, 'login']);
