<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Expense;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $expenses = Expense::with('user')->orderBy('updated_at', 'desc')->paginate(10);
        
    return response()->json($expenses);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $validatedData = $request->validate([
            'user_id' => 'required',
            'expense_date' => 'required|date',
            'description' => 'required|min:10|max:150',
            'amount' => 'required|numeric'
        ]);

        $expense = new Expense();
        $expense->user_id = $validatedData['user_id'];
        $expense->expense_date = $validatedData['expense_date'];
        $expense->description = $validatedData['description'];
        $expense->amount = $validatedData['amount'];
        $expense->save();

        return response()->json([
            'message' => 'Expense added successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $expense = Expense::find($id);
        if($expense){
            return response()->json($expense);
        }else{
            return response()->json([
                'message' => 'Expense not found',
                'status' => 404
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $expense = Expense::find($id);

        if($expense) {
            
            $validatedData = $request->validate([
                'user_id' => 'required',
                'expense_date' => 'required|date',
                'description' => 'required|min:10|max:150',
                'amount' => 'required|numeric'
            ]);

            
            $expense->user_id = $validatedData['user_id'];
            $expense->expense_date = $validatedData['expense_date'];
            $expense->description = $validatedData['description'];
            $expense->amount = $validatedData['amount'];
            $expense->save();

            return response()->json([
                'message' => 'Expense update succesfull',
                'status' => 200
            ]);
        } else {
            return response()->json([
                'message' => 'Expense not found',
                'status' => 404
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $expense = Expense::find($id);
        if($expense){
            $expense->delete();
            return response()->json([
                'message' => 'Expense deleted successfully',
                'status' => 200
            ]);
        }else{
            return response()->json([
                'message' => 'Expense not found',
                'status' => 404
            ]);
        }
    }

     /**
     * Display a listing of the monthly total expenses of each user.
     *
     * @return \Illuminate\Http\Response
     */
    public function monthlyExpenses($month)
    {

        $users = User::with(['expenses' => function($query) use ($month) {
            $query->whereMonth('expense_date', $month);
        }])->get();

        $response = [];
        foreach ($users as $user) {
            $totalExpense = 0;
            foreach ($user->expenses as $expense) {
                $totalExpense += $expense->amount;
            }
            $response[] = [
                'username' => $user->name,
                'total_expense' => $totalExpense,
            ];
        }
    
        return response()->json($response);
    }
    
}
