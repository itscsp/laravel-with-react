<?php

namespace App\Http\Controllers\Api;

use DateTime;
use App\Models\User;
use App\Models\Expense;
use App\Models\Investment;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function users(Request $request){
        $currentRequest =  Auth::user();

        // checking request is by admin user
                
        if (!$currentRequest ||  $currentRequest['role'] != 1) {
            return response([
                'message' => 'Unauthenticated'
            ], 401);
        }

        
        $users = User::where('status', 1)->get();
        
        return response()->json($users);
    }


    public function signup(SignupRequest $userdata){
        $data = $userdata->validated();


        // checking request is by admin user and requested user role is admin
        if($data['role'] == '1'){
            $currentRequest = User::where('email', $data['senderEmail'])->first();
            $currentpassword = !Hash::check($data['senderPassword'], $currentRequest->password);
        }
                       
        if($data['role'] == '1' && $currentpassword){
                return response([
                    'message' => 'Your not allowed to create admin user',
                    'currentpassword' => $currentpassword,
                    'role' => $currentRequest['role'],
                    'sender pass' => $data['senderPassword']
                ], 401);           
        }

                

        $user = User::Create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role' => $data['role'],
            'status' => $data['status']
        ]);

        $token = $user->createToken('main')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
        ];

        return response($response, 201);
    }

    public function login(LoginRequest $request) {

        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

         //checking user credentails 
        if(!$user || !Hash::check($credentials['password'], $user->password)) {
            return response([
                'message' => 'Bad Credentials'
            ], 422);
        }

        //checking user status == active

        if($user['status'] == 0){
            return response([
                'message' => 'You are inactive'
            ], 422);
        }

        

               
        $token = $user->createToken('main')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
        ];

        return response($response, 201);

    }

    public function logout(Request $request){
         /** @var \App\Models\User $user */
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response([
            'message' => 'Your loged out!'
        ]);


    }


    
    public function setStatus($id){
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $currentRequest =  Auth::user();
        
        // checking status change request is by admin user
        if (!$currentRequest ||  $currentRequest['role'] != 1 ) {
            return response([
                'message' => 'Unauthenticated'
            ], 401);
        }
        
       

        $user->status = 0;
        $user->save();

        return response()->json(['message' => 'User status updated to inactive', 'Inactive' => $user]);
    }

    public function monthlyTotals(Request $request)
    {
        $months = Expense::selectRaw('DISTINCT(MONTHNAME(expense_date)) as month, YEAR(expense_date) as year')
                            ->get();

        $monthList = [];

        foreach ($months as $month) {
            $date = date_create_from_format("F Y", $month->month . ' ' . $month->year);
            $newFormat = $date->format("m/Y");
            $monthList[] =  ['value' => $newFormat, 'label' => $month->month . ' ' . $month->year];
        }



        $month = $request->month;
        $year = $request->year;


        // Get the total expenses of the current month
            $totalExpenses = Expense::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->sum('amount');

            $totalInvestment = Investment::whereMonth('investment_date', $month)
            ->whereYear('investment_date', $year)
            ->sum('amount');

            $directInvestments =  Investment::whereMonth('investment_date', $month)
            ->whereYear('investment_date', $year)
            ->where('investment_type', 'direct')
            ->sum('amount');
            

        // Get the total number of active users
        $users = User::where('status', 1)->get();
        $totalUsers = $users->count();

        // Divide the total expenses by the total number of active users
            $expensesPerUser = ceil($totalExpenses / $totalUsers);
      
        // Get the total expenses of each user
            $expenses = Expense::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->groupBy('user_id')
            ->selectRaw('user_id, SUM(amount) as total_expense')
            ->get();


        // Get the total investments of each user
        $investments = Investment::whereMonth('investment_date', $month)
            ->whereYear('investment_date', $year)
            ->groupBy('user_id')
            ->selectRaw('user_id, SUM(amount) as total_investment')
            ->get();

         

        $result = [];
        foreach ($users as  $key => $user) {
            $user_id = $user->id;
            $expense = $expenses->where('user_id', $user_id)->first();

            $investment = $investments->where('user_id', $user_id)->first();
            // $is_investment = ($investment->total_investment) ?  
            if(is_null($investment)){
                $difference = 0;
            }else{
                $difference = $investment->total_investment - $expensesPerUser;
            }

            if ($difference > 0) {
                $result[$key] = [
                    'user_id' => $user_id,
                    'user_name' => $user->name,
                    'total_share' => $expensesPerUser,
                    'total_expense' => $expense ? $expense->total_expense : 0,
                    'total_investment' => ($difference == 0) ? 0 : $investment->total_investment ,
                    'to_receive' => abs(($difference == 0) ? 0 : $investment->total_investment - $expensesPerUser),
                ];
            } else {
                $result[$key] = [
                    'user_id' => $user_id,
                    'user_name' => $user->name,
                    'total_share' => $expensesPerUser,
                    'total_expense' => $expense ? $expense->total_expense : 0,
                    'total_investment' => ($difference == 0) ? 0 : $investment->total_investment,
                    'to_pay' => abs(number_format( ($difference == 0) ? 0 : $investment->total_investment, 2) - $expensesPerUser),
                ];
            }
           
        }
        
       

        return response() ->json([
            'Total_expense_of_month' => $totalExpenses,
            'Total_investment_of_month' => $directInvestments,
            'Month_list' => $monthList,
       
            'result' => $result,
        ]);
    }

    public function currentUser(Request $request, $id) {
        $user = User::find($id);
        if(!$user) {
            return response()->json([
                'message' => 'User not found',
                'status' => 404
            ]);
        }
        return response()->json($user);
    }
    
    public function ActiveUser(Request $request) {
        return $request->user(); 
    }


}
