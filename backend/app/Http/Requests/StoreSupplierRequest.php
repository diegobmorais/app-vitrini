<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_name' => 'required|string|max:190',
            'cnpj' => 'required|string|max:100|unique:suppliers,cnpj',
            'contact_name' => 'nullable|string|max:190',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',     
            'notes' => 'nullable|string',
            'status' => 'required|boolean',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|size:2',
            'zipcode' => 'nullable|string|max:10',
        ];
    }
    public function messages(): array
    {
        return [
            'company_name.required' => 'O nome da empresa é obrigatório.',
            'cnpj.required' => 'O CNPJ é obrigatório.',
            'phone.required' => 'O telefone é obrigatório.',          
        ];
    }
}
