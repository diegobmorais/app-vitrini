<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        $productId = $this->route('id');
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'required|string|max:100|unique:products,sku',
            'barcode' => 'nullable|string|max:50|unique:products,barcode',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|gte:price',
            'cost' => 'nullable|numeric|min:0',
            'tax_class' => 'nullable|string|in:default,standard,reduced,zero',
            'track_inventory' => 'required|boolean',
            'stock' => 'required_if:track_inventory,true|integer|min:0',
            'supplier_id' => 'nullable|integer|exists:suppliers,id',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'allow_backorders' => 'required|boolean',
            'status' => 'required|in:active,inactive,draft',
            'featured' => 'required|boolean',
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',          
            'images' => 'nullable|array',
            'images.*' => 'url'
        ];
    }
}
