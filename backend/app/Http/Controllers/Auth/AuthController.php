<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            // Regenera a sessão e cria o token de API
            $request->session()->regenerate();

            return response()->json([
                'user' => Auth::user(),
                'session_id' => session()->getId()
            ])->withCookie(cookie(
                'laravel_session',
                session()->getId(),
                0,
                '/',
                parse_url(env('APP_URL'), PHP_URL_HOST),
                false,
                true
            ));
        }

        return response()->json([
            'message' => 'Credenciais inválidas'
        ], 401);
    }
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout efetuado com sucesso.']);
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 2,
        ]);

        return response()->json(['message' => 'Usuário registrado com sucesso.', 'user' => $user], 201);
    }
    public function checkAuth(Request $request)
    {
        return response()->json([
            'authenticated' => Auth::check(),
            'user' => Auth::user() ?? null,
            'session_id' => session()->getId()
        ]);
    }
}
