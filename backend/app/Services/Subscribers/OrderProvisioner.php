<?php

namespace App\Services\Subscribers;

use App\Models\ActionLog;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderProvisioner
{
    public function __construct(private DatabaseManager $database)
    {
    }

    /**
     * Cria uma assinatura ativa para o usuário informado, reproduzindo a lógica do painel administrativo.
     *
     * @throws RuntimeException Quando não há produto padrão configurado e nenhum foi informado.
     */
    public function provisionOrder(
        User $user,
        ?int $productId = null,
        ?float $amount = null,
        ?int $forcedOrderId = null,
        ?int $actionBy = null,
        bool $useTransaction = true,
        ?array $notificationOverride = null
    ): Order {
        $callback = function () use ($user, $productId, $amount, $forcedOrderId, $actionBy, $notificationOverride) {
            $resolvedProductId = $this->resolveProductId($productId);
            $resolvedAmount = $this->resolveAmount($amount);
            $orderId = $forcedOrderId ?: $this->nextOrderId();

            $order = Order::create([
                'id' => $orderId,
                'users_id' => $user->id,
                'products_id' => $resolvedProductId,
                'status' => Order::STATUS_ACTIVE,
                'amount' => $resolvedAmount,
                'separation_status' => Order::SEPARATION_STATUS_PENDING,
            ]);

            $this->registerAction($order, 'criado', 'Solicitação aprovada pelo painel', $actionBy);
            $this->registerAction($order, 'aprovado', 'Aprovação automática via painel', $actionBy);

            $notificationPayload = [
                'user_id' => null,
                'type' => 'subscriber_approved',
                'title' => 'Assinatura aprovada',
                'body' => sprintf('Assinatura do usuário ID %d foi aprovada.', $user->id),
                'data' => [
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                    'products_id' => $order->products_id,
                ],
            ];

            if ($notificationOverride) {
                $overrideData = null;
                if (array_key_exists('data', $notificationOverride)) {
                    $overrideData = is_array($notificationOverride['data'])
                        ? $notificationOverride['data']
                        : [];
                    unset($notificationOverride['data']);
                }

                $notificationPayload = array_replace($notificationPayload, $notificationOverride);

                if ($overrideData !== null) {
                    $notificationPayload['data'] = array_replace(
                        $notificationPayload['data'] ?? [],
                        $overrideData
                    );
                }
            }

            Notification::create($notificationPayload);

            return $order;
        };

        if ($useTransaction) {
            return $this->database->transaction($callback);
        }

        return $callback();
    }

    private function resolveProductId(?int $productId): int
    {
        if ($productId) {
            return $productId;
        }

        $configId = (int) (config('services.subscribers.default_product_id') ?? 0);
        if ($configId) {
            $exists = Product::query()->whereKey($configId)->exists();
            if ($exists) {
                return $configId;
            }
        }

        $first = Product::query()->select('id')->orderBy('id')->first();
        if ($first) {
            return (int) $first->id;
        }

        throw new RuntimeException('Nenhum plano padrão disponível para criação automática de assinatura.');
    }

    private function resolveAmount(?float $amount): float
    {
        if ($amount !== null) {
            return $amount;
        }

        return (float) (config('services.subscribers.default_amount') ?? 0);
    }

    private function nextOrderId(): int
    {
        $maxId = DB::table('orders')->max('id') ?? 0;
        return (int) $maxId + 1;
    }

    private function registerAction(Order $order, string $action, string $reason, ?int $actionBy): void
    {
        ActionLog::create([
            'order_id' => $order->id,
            'product_id' => $order->products_id,
            'user_id' => $order->users_id,
            'action' => $action,
            'quantity' => null,
            'reason' => $reason,
            'action_by' => $actionBy,
            'created_at' => now(),
        ]);
    }
}
