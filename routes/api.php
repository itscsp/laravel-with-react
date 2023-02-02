<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ExpenseController;

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
    Route::post('/signup', [AuthController::class, 'signup']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('users/{id}', [AuthController::class, 'setStatus']);

    Route::get('/user', [ExpenseController::class, 'currentUser']);

    Route::get('/users', [AuthController::class, 'users']);

    
    Route::post('/add-expense', [ExpenseController::class, 'store']);
    Route::get('/expenses', [ExpenseController::class, 'index']); // over all expenses list
    Route::get('expenses/{month}', [ExpenseController::class, 'getExpensesByMonth']);
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);
    Route::get('/expenses/{id}', [ExpenseController::class, 'show']);
    Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
    Route::patch('/expenses/{id}', [ExpenseController::class, 'update']);
    Route::get('/monthly-expenses-investment/{month}', [ExpenseController::class,'monthlyExpenseInvestment']); // each user total expenses, investment and to pay or to recieve 
    Route::get('/monthly-total-expenses/{month}', [ExpenseController::class,'monthlyExpensesAddedByEachUser']); //each user added total expenses of a particuler month
    


});

Route::post('/login', [AuthController::class, 'login']);
