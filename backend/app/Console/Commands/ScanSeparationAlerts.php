<?php

namespace App\Console\Commands;

use App\Models\SeparationAlert;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ScanSeparationAlerts extends Command
{
    protected $signature = 'separation:scan-alerts
                            {--window=15 : Dias da janela (novos na janela)}
                            {--deadline=3 : Dias restantes p/ prazo curto}
                            {--stalled=3 : Dias parado p/ considerar "stalled"}';

    protected $description = 'Gera alertas de SLA: novos na janela, prazo curto, e pedidos parados.';

    public function handle(): int
    {
        $today = Carbon::today();
        $windowDays = (int) $this->option('window');
        $deadlineDays = (int) $this->option('deadline');
        $stalledDays = (int) $this->option('stalled');

        // Ajuste conforme seu domínio:
        $flowStatuses = ['waiting', 'separating', 'ready', 'shipping'];

        // 1) Entraram na janela (próx. X dias)
        $incoming = DB::table('orders')
            ->select('id', 'status', 'next_shipment_date')
            ->whereIn('status', $flowStatuses)
            ->whereDate('next_shipment_date', '>=', $today)
            ->whereDate('next_shipment_date', '<=', $today->copy()->addDays($windowDays))
            ->get();

        foreach ($incoming as $o) {
            $this->upsertAlert($o->id, 'new_incoming', [
                'title' => 'Entrou na janela de envio',
                'message' => "Pedido #{$o->id} entrou na janela de {$windowDays} dias.",
                'payload' => [
                    'order_id' => $o->id,
                    'next_shipment_date' => $o->next_shipment_date,
                    'window_days' => $windowDays,
                ],
                'key_date' => $today->toDateString(),
            ]);
        }

        // 2) Prazo curto (faltam <= deadlineDays)
        $deadline = DB::table('orders')
            ->select('id', 'status', 'next_shipment_date')
            ->whereIn('status', $flowStatuses)
            ->whereDate('next_shipment_date', '>=', $today)
            ->whereRaw('DATEDIFF(next_shipment_date, ?) <= ?', [$today->toDateString(), $deadlineDays])
            ->get();

        foreach ($deadline as $o) {
            $daysLeft = Carbon::today()->diffInDays(Carbon::parse($o->next_shipment_date), false);
            $this->upsertAlert($o->id, 'deadline_near', [
                'title' => 'Prazo curto',
                'message' => "Faltam {$daysLeft} dia(s) para envio do pedido #{$o->id}.",
                'payload' => [
                    'order_id' => $o->id,
                    'days_left' => $daysLeft,
                    'next_shipment_date' => $o->next_shipment_date,
                ],
                'key_date' => $today->toDateString(),
            ]);
        }

        // 3) Parado há N dias (usa updated_at como fallback)
        $stalledThreshold = Carbon::today()->subDays($stalledDays);
        $stalled = DB::table('orders')
            ->select('id', 'status', 'updated_at')
            ->whereIn('status', $flowStatuses)
            ->whereDate('updated_at', '<=', $stalledThreshold)
            ->get();

        foreach ($stalled as $o) {
            $daysStalled = Carbon::parse($o->updated_at)->diffInDays($today);
            $this->upsertAlert($o->id, 'stalled', [
                'title' => 'Parado na fila',
                'message' => "Pedido #{$o->id} parado em '{$o->status}' há {$daysStalled} dia(s).",
                'payload' => [
                    'order_id' => $o->id,
                    'status' => $o->status,
                    'days_stalled' => $daysStalled,
                    'last_change' => $o->updated_at,
                ],
                'key_date' => $today->toDateString(),
            ]);
        }

        $this->info('Scan finalizado.');

        return self::SUCCESS;
    }

    private function upsertAlert(int $orderId, string $type, array $data): void
    {
        SeparationAlert::updateOrCreate(
            [
                'order_id' => $orderId,
                'type' => $type,
                'key_date' => $data['key_date'] ?? now()->toDateString(),
            ],
            [
                'title' => $data['title'] ?? null,
                'message' => $data['message'] ?? null,
                'payload' => $data['payload'] ?? null,
            ]
        );
    }
}
