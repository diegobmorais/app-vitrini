<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
        $productId = $this->route('product')?->id ?? null;
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => [
                'required',
                'string',
                Rule::unique('products')->ignore($productId),
            ],
            'barcode' => [
                'nullable',
                Rule::unique('products')->ignore($productId),
            ],
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|gte:price',
            'cost' => 'nullable|numeric|min:0',
            'tax_class' => 'nullable|string|in:default,standard,reduced,zero',
            'track_inventory' => 'required|boolean',
            'stock' => 'required_if:track_inventory,true|integer|min:1',
            'supplier_id' => 'nullable|integer|exists:suppliers,id',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'allow_backorders' => 'nullable|boolean',
            'status' => 'nullable|in:active,inactive,draft',
            'featured' => 'nullable|boolean',
            'category_id' => 'nullable|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',            
        ];
    }
    public function messages()
    {
        return [
            // Required
            'name.required' => 'O nome do produto é obrigatório.',
            'name.unique' => 'Você já possui um produto com este nome',
            'sku.required' => 'O SKU é obrigatório.',
            'price.required' => 'O preço é obrigatório.',
            'track_inventory.required' => 'Informe se o estoque deve ser controlado.',
            'allow_backorders.required' => 'Informe se o produto permite encomendas.',
            'status.required' => 'O status do produto é obrigatório.',
            'featured.required' => 'Informe se o produto é destaque.',
            'category_id.required' => 'A categoria do produto é obrigatória.',

            // Unique
            'sku.unique' => 'Este SKU já está em uso.',
            'barcode.unique' => 'Este código de barras já está em uso.',

            // Exists
            'category_id.exists' => 'Categoria inválida.',
            'brand_id.exists' => 'Marca inválida.',
            'supplier_id.exists' => 'Fornecedor inválido.',          
        ];
    }
}
