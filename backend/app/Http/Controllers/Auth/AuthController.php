<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {   
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
        if (!Auth::attempt($credentials)){
            return response()->json(["message" => "Invalid Credentials"], 401);
        }
        $user = Auth::user();
        $token = $user->createToken('Token')->plainTextToken;
    
        return response()->json( [
            'user' => $user,
            'token' => $token
        ], 200);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
}
