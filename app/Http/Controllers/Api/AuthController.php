<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
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


    
    public function setStatus($id)
    {
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


}
