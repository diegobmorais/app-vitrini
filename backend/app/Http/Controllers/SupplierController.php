<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status === 'active' ? 1 : 0;
            $query->where('status', $status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('company_name', 'like', '%' . $request->search . '%')
                    ->orWhere('cnpj', 'like', '%' . $request->search . '%')
                    ->orWhere('contact_name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = $request->input('per_page', 10);

        return response()->json(
            $query->paginate($perPage)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access Danied'], 403);
        }

        $data = $request->validated();

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
    public function update(StoreSupplierRequest $request, Supplier $supplier)
    {   dd(Auth::user());
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access Danied'], 403);
        }

        $data = $request->validated();

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
