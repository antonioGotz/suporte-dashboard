<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Order;

class SubscriberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * This preserves the existing response shape expected by the frontend.
     */
    public function toArray($request)
    {
        // If the resource is already a prepared array (e.g., pending user case), just return it as-is
        if (is_array($this->resource)) {
            return $this->resource;
        }

        // Handle Order model mapping
        if ($this->resource instanceof Order) {
            $order = $this->resource;

            // Recupera a última ação do log (se disponível)
            $lastAction = $order->last_action ?? null;
            $lastReason = $order->last_reason ?? null;
            $lastActionAt = $order->last_action_at ?? null;

            // Determina status_code e status_label conforme a última ação
            $statusCode = $order->status;
            $statusLabel = match ($statusCode) {
                'active' => 'ATIVO',
                'canceled' => 'CANCELADO',
                default => strtoupper($statusCode ?? ''),
            };
            if ($lastAction === 'suspenso') {
                $statusCode = 'suspended';
                $statusLabel = 'SUSPENSO';
            } elseif ($lastAction === 'cancelado') {
                $statusCode = 'canceled';
                $statusLabel = 'CANCELADO';
            } elseif ($lastAction === 'reativado' || $lastAction === 'aprovado') {
                $statusCode = 'active';
                $statusLabel = 'ATIVO';
            }

            return [
                'id' => $order->id,
                'order_id' => $order->id,
                'user_id' => $order->users_id,
                // Compatibilidade com tela de detalhes existente
                'name' => optional($order->user)->name,
                'user_name' => optional($order->user)->name,
                'user_email' => optional($order->user)->email,
                'plan_id' => $order->products_id,
                'plan_name' => optional($order->product)->name ?? 'Plano Não Definido',
                'subscription_date' => optional($order->created_at)?->toDateTimeString(),
                'order_status' => $order->status,
                'gateway_status' => null,
                // Campo auxiliar para telas/admin
                'is_active' => ($statusCode === 'active'),
                // Placeholder até integração de gateway real
                'payment_status' => null,
                'status_code' => $statusCode,
                'status_label' => $statusLabel,
                'last_action' => $lastAction,
                'last_reason' => $lastReason,
                'last_action_at' => $lastActionAt,
                // Dados pessoais
                'email' => optional($order->user)->email,
                'phone' => optional($order->user)->phone,
                'document' => optional($order->user)->document,
                'address' => optional($order->user)->address,
                'number' => optional($order->user)->number,
                'city' => optional($order->user)->city,
                'state' => optional($order->user)->state,
                // Histórico de pedidos (com produto)
                'orders' => Order::with('product:id,name')
                    ->where('users_id', $order->users_id)
                    ->orderByDesc('id')
                    ->get(),
                // Filhos
                'children' => optional($order->user)->children ?? [],
            ];
        }

        // Fallback (should not occur): return resource as array
        return (array) $this->resource;
    }
}
