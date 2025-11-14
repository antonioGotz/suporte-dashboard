<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * Lista todos os produtos com seu estoque atual e status.
     */
    public function index(Request $request)
    {
        $products = DB::table('products')
            ->whereNull('deleted_at')
            ->select('id', 'name', 'stock')
            ->orderBy('name', 'asc')
            ->paginate(20); // Paginação para performance

        return response()->json($products);
    }

    /**
     * Atualiza o estoque de um produto e registra a movimentação.
     */
    public function update(Request $request, $productId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer', // Quantidade a ser adicionada (positiva) ou removida (negativa)
            'reason' => 'required|string|max:255',
        ]);

        $product = DB::table('products')->find($productId);

        if (! $product) {
            return response()->json(['message' => 'Produto não encontrado.'], 404);
        }

        try {
            DB::transaction(function () use ($product, $validated, $request) {
                // 1. Atualiza o estoque na tabela de produtos
                DB::table('products')
                    ->where('id', $product->id)
                    ->increment('stock', $validated['quantity']); // Usa increment para segurança

                // 2. Registra a movimentação no histórico (actions_log)
                DB::table('actions_log')->insert([
                    'product_id' => $product->id,
                    'action' => 'ajuste_estoque',
                    'quantity' => $validated['quantity'],
                    'reason' => $validated['reason'],
                    'action_by' => $request->user()->id, // Pega o ID do admin logado
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o estoque: '.$e->getMessage()], 500);
        }

        // Retorna o novo estoque do produto
        $newStock = DB::table('products')->where('id', $productId)->value('stock');

        return response()->json([
            'message' => 'Estoque atualizado com sucesso!',
            'new_stock' => $newStock,
        ]);
    }
}
