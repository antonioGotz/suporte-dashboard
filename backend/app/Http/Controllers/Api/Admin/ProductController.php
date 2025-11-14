<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest; // <-- Usando Eloquent
use App\Http\Requests\UpdateProductRequest; // <-- Usando Form Request
use App\Models\Product; // <-- Usando Form Request
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Construtor para aplicar a autorização da Policy em todos os métodos.
     */
    public function __construct()
    {
        // Aplica a autorização da ProductPolicy a todos os métodos do resource.
        $this->authorizeResource(Product::class, 'product');
    }

    /**
     * Lista todos os produtos (GET /products)
     */
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->orderBy($request->input('sort', 'id'), $request->input('order', 'desc'))
            ->paginate(20);

        // Monta a URL completa da imagem para cada produto
        $storageBaseUrl = config('app.url') . '/storage';
        $products->getCollection()->transform(function ($product) use ($storageBaseUrl) {
            if ($product->image) {
                $product->image_url = $storageBaseUrl . '/' . ltrim($product->image, '/');
            } else {
                $product->image_url = null;
            }
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Cria um novo produto (POST /products)
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        // A validação já foi feita pela classe StoreProductRequest.
        $product = Product::create($request->validated());
        $storageBaseUrl = config('app.url') . '/storage';
        if ($product->image) {
            $product->image_url = $storageBaseUrl . '/' . ltrim($product->image, '/');
        } else {
            $product->image_url = null;
        }
        return response()->json($product, 201);
    }

    /**
     * Exibe um produto específico (GET /products/{product})
     */
    public function show(Product $product): JsonResponse
    {
        // O Laravel já encontra o produto pelo ID ou retorna 404 (Route Model Binding).
        $storageBaseUrl = config('app.url') . '/storage';
        if ($product->image) {
            $product->image_url = $storageBaseUrl . '/' . ltrim($product->image, '/');
        } else {
            $product->image_url = null;
        }
        return response()->json($product);
    }

    /**
     * Atualiza um produto (PUT/PATCH /products/{product})
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        // A validação já foi feita e o produto já foi encontrado.
        $product->update($request->validated());
        $storageBaseUrl = config('app.url') . '/storage';
        if ($product->image) {
            $product->image_url = $storageBaseUrl . '/' . ltrim($product->image, '/');
        } else {
            $product->image_url = null;
        }
        return response()->json($product);
    }

    /**
     * Exclui um produto (DELETE /products/{product})
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete(); // Soft delete

        return response()->json(null, 204); // 204 No Content é a resposta padrão para delete
    }

    /**
     * Retorna uma lista de produtos que são planos de assinatura.
     */
    public function listSubscriptionPlans(): JsonResponse
    {
        // Como esta não é uma ação de CRUD padrão, a autorização é manual.
        $this->authorize('viewAny', Product::class);

        $plans = Product::query()
            ->where('signature', true)
            ->select('id', 'name', 'price')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($plans);
    }
}
