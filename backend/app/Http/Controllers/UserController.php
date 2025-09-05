<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('addresses')
        ]);
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['sometimes', 'string', 'max:20'],
            'birth_day' => ['sometimes', 'date'],
            'current_password' => ['nullable', 'required_with:new_password', 'current_password'],
            'new_password' => ['nullable', 'required_with:current_password', Password::defaults()],
            'new_password_confirmation' => ['nullable', 'same:new_password'],
        ]);

        $user->fill($request->only(['name', 'email', 'phone', 'birth_day']));

        if ($request->filled('new_password') && $request->filled('current_password')) {
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        return response()->json(['message' => 'Perfil atualizado com sucesso.']);
    }
}
