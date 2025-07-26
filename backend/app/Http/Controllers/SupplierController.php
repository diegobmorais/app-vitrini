<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = Supplier::all();

        return response()->json($suppliers);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('suppliers/logos', 'public');
        }

        $supplier = Supplier::create($data);

        return response()->json([
            'message' => 'Supplier created successfully.',
            'data' => $supplier
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        return response()->json($supplier);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($supplier->logo && Storage::disk('public')->exists($supplier->logo)) {
                Storage::disk('public')->delete($supplier->logo);
            }

            $data['logo'] = $request->file('logo')->store('suppliers/logos', 'public');
        }

        $supplier->update($data);

        return response()->json([
            'message' => 'Supplier updated successfully.',
            'data' => $supplier
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        if ($supplier->logo && Storage::disk('public')->exists($supplier->logo)) {
            Storage::disk('public')->delete($supplier->logo);
        }

        $supplier->delete();

        return response()->json([
            'message' => 'Supplier deleted successfully.'
        ]);
    }
}
