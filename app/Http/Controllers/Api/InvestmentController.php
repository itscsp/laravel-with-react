<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Investment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class InvestmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $investments = Investment::with('user')->orderBy('updated_at', 'desc')->paginate(10);

        return response()->json($investments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      
        $validator = $request->validate([
            'user_id' => 'required',
            'investment_date' => 'required|date',
            'amount' => 'required|numeric',
            'added_by' => 'required|string',
            'investment_type' => 'required|in:direct,indirect',
        ]);

        $user = User::where('id', $validator['user_id'])->first();

        if($validator['investment_type'] == 'direct'){

            if($validator['added_by'] != 'AdminUser'){
                return response()->json([
                    'message' => 'You are not allowed direct investment'
                ], 401);
            }

            $investment = Investment::create([
                'user_id' => $validator['user_id'],
                'investment_date' => $validator['investment_date'],
                'amount' => $validator['amount'],
                'added_by' => $validator['added_by'],
                'investment_type' => $validator['investment_type'],
            ]);
        }else {
            $investment = Investment::create([
                'user_id' => $validator['user_id'],
                'investment_date' => $validator['investment_date'],
                'amount' => $validator['amount'],
                'added_by' => $validator['added_by'],
                'investment_type' => $validator['investment_type'],
            ]);
        }
        
        return response()->json([
            'data' => $investment,
            'message' => 'Investment added successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Investment  $investment
     * @return \Illuminate\Http\Response
     */
    public function show(Investment $investment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Investment  $investment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Investment $investment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Investment  $investment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Investment $investment)
    {
        //
    }

    public function getInvestmentByMonth(Request $request)
    {
        $month = $request->month;
        $year = $request->year;

        $investments = Investment::whereYear('investment_date', $year)
                                ->whereMonth('investment_date', $month)
                                ->with('user')
                                ->get();

        return response()->json([
            'investments' => $investments
        ]);
    }
}
