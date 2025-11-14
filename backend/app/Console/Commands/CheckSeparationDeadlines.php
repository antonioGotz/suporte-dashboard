<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CheckSeparationDeadlines extends Command
{
    protected $signature = 'deadlines:check';

    protected $description = 'Cria notificações para separações próximas do prazo ou atrasadas';

    public function handle(): int
    {
        $soonHours = (int) config('notifications.separation_due_soon_hours', 24);
        $overdueHours = (int) config('notifications.separation_overdue_hours', 48);

        // Critérios:
        // - Em separação há >= soonHours -> due_soon
        // - Em separação há >= overdueHours -> overdue
        // Ajuste fácil via config.

        $now = Carbon::now();

        $inSeparation = Order::query()
            ->where('separation_status', Order::SEPARATION_STATUS_IN_PROGRESS)
            ->get(['id', 'users_id', 'products_id', 'created_at', 'updated_at']);

        $createdSoonAt = $now->copy()->subHours($soonHours);
        $createdOverdueAt = $now->copy()->subHours($overdueHours);

        $created = 0;

        foreach ($inSeparation as $order) {
            // Usa updated_at como referência do início da etapa de separação quando possível
            $ref = $order->updated_at ?? $order->created_at ?? $now;

            if ($ref <= $createdOverdueAt) {
                $created += $this->notifyOnce('separation_overdue', $order, [
                    'title' => 'Prazo de separação atrasado',
                    'body'  => sprintf('Pedido #%d está em separação e ultrapassou o prazo.', $order->id),
                ]);
                continue;
            }

            if ($ref <= $createdSoonAt) {
                $created += $this->notifyOnce('separation_due_soon', $order, [
                    'title' => 'Prazo de separação se aproximando',
                    'body'  => sprintf('Pedido #%d segue em separação e se aproxima do prazo.', $order->id),
                ]);
            }
        }

        $this->info("Notificações criadas: {$created}");
        return Command::SUCCESS;
    }

    protected function notifyOnce(string $type, Order $order, array $payload): int
    {
        // Evita duplicar muitas notificações: se já existir uma do mesmo tipo para o pedido nas últimas 12h, não cria.
        $q = Notification::query()
            ->where('type', $type)
            ->where('created_at', '>=', now()->subHours(12));

        try {
            $exists = $q->whereJsonContains('data->order_id', $order->id)->exists();
        } catch (\Throwable $e) {
            // Fallback para bancos sem JSON path: busca textual
            $exists = $q->where('data', 'like', '%"order_id":'.(int)$order->id.'%')->exists();
        }

        if ($exists) {
            return 0;
        }

        Notification::create([
            'user_id' => null,
            'type'    => $type,
            'title'   => $payload['title'] ?? ucfirst(str_replace('_', ' ', $type)),
            'body'    => $payload['body'] ?? null,
            'data'    => [
                'order_id'    => $order->id,
                'user_id'     => $order->users_id,
                'products_id' => $order->products_id,
            ],
        ]);

        return 1;
    }
}
