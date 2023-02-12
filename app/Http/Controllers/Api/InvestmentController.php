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

        // $user = User::where('id', $validator['user_id'])->first();

        if($validator['investment_type'] == 'direct'){

            if($validator['added_by'] != 'Admin'){
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
    public function show($id)
    {
        //

        $investment = Investment::find($id);
        if ($investment) {
            return response()->json([
                'investment' => $investment
            ], 200);
        } else {
            return response()->json([
                'message' => 'Investment not found'
            ], 404);
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Investment  $investment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validInvestment = Investment::find($id);

        if (!$validInvestment) {
            return response()->json(['error' => 'Investment not found'], 404);
        }

        $validator = $request->validate([
            'user_id' => 'required',
            'investment_date' => 'required|date',
            'amount' => 'required|numeric',
            'added_by' => 'required|string',
            'investment_type' => 'required|in:direct',
        ]);

        // Find the investment with the given ID

        

        if($validator['investment_type'] != 'direct'){
            return response()->json(['error' => 'Your not allowed to edit this investment'], 404);
        }

         // Update the investment
         $validInvestment->user_id = $validator['user_id'];
         $validInvestment->investment_date = $validator['investment_date'];
         $validInvestment->amount = $validator['amount'];
         $validInvestment->save();
 
         return response()->json(['message' => 'Investment updated successfully']);


    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Investment  $investment
     * @return \Illuminate\Http\Response
     */
    
    public function destroy(Request $request, $id)
    {
        $investment = Investment::find($id);

        if(!$investment) {
            return response()->json(['error' => 'Investment not found'], 404);
        }

        if ($request->user()->role === 1) {
            $investment->delete();
            return response([
                'message' => 'Investment deleted successfully',
                'investment' => $investment
            ], 200);
        }

        return response(['message' => 'You are not authorized to delete this investment'], 403);
    }

    public function getInvestmentByMonth(Request $request)
    {

        $month = $request->month;
        $year = $request->year;

        $users = User::where('status', 1)->get();

        $investments = Investment::whereYear('investment_date', $year)
                                ->whereMonth('investment_date', $month)
                                ->where('investment_type', 'direct')
                                ->with('user')
                                ->get();

        return response()->json([
            'investments' => $investments,
            'users' => $users
        ]);
    }
}
