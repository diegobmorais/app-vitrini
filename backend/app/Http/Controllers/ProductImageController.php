<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    // Listar imagens de um produto
    public function index($productId)
    {   
        $product = Product::with('images')->findOrFail($productId);
        return response()->json($product->images);
    }

    // Adicionar imagem(s) ao produto
    public function store(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        $paths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $paths[] = [
                    'url' => Storage::url($file->store('products', 'public'))
                ];
            }
        }

        $product->images()->createMany($paths);

        return response()->json([
            'message' => 'Imagens salvas com sucesso!',
            'images' => $product->images
        ], 201);
    }

    // Remover uma imagem
    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);

        // Remove o arquivo do disco
        $path = str_replace('/storage/', '', $image->url);
        Storage::disk('public')->delete($path);

        $image->delete();

        return response()->json([
            'message' => 'Imagem removida com sucesso.'
        ]);
    }
    public function uploadTempImages(Request $request)
    {
        $request->validate([
            'upload_session_id' => 'required|string',
            'images.*' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $sessionId = $request->input('upload_session_id');
        $uploadedImages = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store("temp/{$sessionId}", 'public');

                $uploadedImages[] = [
                    'url' => Storage::url($path),
                    'path' => $path,
                ];
            }
        }

        return response()->json([
            'message' => 'Imagens temporárias enviadas com sucesso',
            'images' => $uploadedImages,
            'upload_session_id' => $sessionId,
        ], 201);
    }
    public function deleteTemp(Request $request)
    {
        $tempPath = $request->query('temp_path');

        if (!$tempPath) {
            return response()->json(['message' => 'temp_path é obrigatório'], 422);
        }

        if (Storage::disk('public')->exists($tempPath)) {
            Storage::delete($tempPath);
            return response()->json(['message' => 'Imagem temporária deletada']);
        }

        return response()->json(['message' => 'Arquivo não encontrado'], 404);
    }       
    public function moveImagesFromTemp($uploadSessionId, Product $product)
    {          
        if (!$uploadSessionId) return;
    
        $tempPath = "temp/$uploadSessionId";
        $files = Storage::disk('public')->files($tempPath);
        $imageRecords = [];
     
        foreach ($files as $file) {
            $newPath = str_replace($tempPath, "products/{$product->id}", $file);
            Storage::disk('public')->move($file, $newPath);
    
            $imageRecords[] = [
                'url' => Storage::url($newPath),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
    
        if (!empty($imageRecords)) {
            $product->images()->createMany($imageRecords);
        }
    
        Storage::disk('public')->deleteDirectory("temp/{$uploadSessionId}");
    }
    public function setMainImage(Request $request, $id)
    {
        $request->validate([
            'image_id' => 'required|exists:product_images,id',
        ]);

        $product = Product::findOrFail($id);

        $image = ProductImage::where('id', $request->image_id)->where('product_id', $id)->firstOrFail();

        $product->main_image_id = $image->id;
        $product->save();

        return response()->json(['message' => 'Imagem principal definida com sucesso.']);
    }
    
}
