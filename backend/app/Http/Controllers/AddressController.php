<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $address = Address::where('user_id', Auth::id())->get();
        return response()->json($address);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAddressRequest $request)
    {
        if ($request->for_delivery) {
            Address::where('user_id', Auth::id())->update(['for_delivery' => false]);
        }

        $address = Address::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return response()->json(['message' => 'Address created.', 'address' => $address], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($address);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAddressRequest $request, $id)
    {
        $endereco = Address::findOrFail($id);

        if ($endereco->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        if ($request->has('for_delivery') && $request->for_delivery) {
            Address::where('user_id', auth()->id())
                ->where('id', '!=', $endereco->id)
                ->update(['for_delivery' => false]);
        }

        $endereco->update($request->validated());

        return response()->json(['message' => 'Endereço atualizado com sucesso.', 'endereco' => $endereco]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $endereco = Address::where('user_id', Auth::id())->findOrFail($id);
        $endereco->delete();

        return response()->json(['message' => 'Address deleted sussessful.']);
    }
}
