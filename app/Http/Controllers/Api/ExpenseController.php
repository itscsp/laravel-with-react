<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Expense;
use App\Models\Investment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        $currentMonth = date('n');
        $expenseMonth = (int)date("n", strtotime($request->expense_date));
    
        if ($currentMonth == $expenseMonth) {
            $expense = new Expense();
            $expense->user_id = $validatedData['user_id'];
            $expense->expense_date = $validatedData['expense_date'];
            $expense->description = $validatedData['description'];
            $expense->amount = $validatedData['amount'];
            $expense->save();

            $user = User::find($validatedData['user_id']);

            if($expense) {
                $investment = Investment::create([
                    'user_id' => $validatedData['user_id'],
                    'investment_date' => $validatedData['expense_date'],
                    'amount' =>  $validatedData['amount'],
                    'added_by' => $user->name,
                    'investment_type' => 'indirect',
                ]);
            }
        } else {
            return response()->json(['message' => 'Expense date is not matching with present month'], 400);
        }

        return response()->json([
            'message' => 'Expense and investment added successfully',
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

    public function getExpensesByMonth(Request $request)
    {
        $month = $request->month;
        $year = $request->year;

       
        $expenses = Expense::whereYear('expense_date', $year)
                ->whereMonth('expense_date', $month)
                ->with('user')
                ->get();

        return response()->json([
            'expenses' => $expenses
        ]);
    }
    
}
