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
        $users = User::all();
        
        return response()->json($users);
    }

       public function signup(SignupRequest $request){
        $data = $request->validated();

        /** @var \App\Models\User $user */

        $userPermision = User::where('email', $data['senderEmail'])->first();

        if (!$userPermision ||  $userPermision['role'] != 1 || !Hash::check($data['senderPassword'], $userPermision->password)) {

            return response([
                'message' => 'Unauthenticated'
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

        if(!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email address or password is in coreect'
            ],422);
        }

         /** @var \App\Models\User $user */
        $user = Auth::user();
       
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
}
