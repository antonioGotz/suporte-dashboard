<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\DemoSignupRequest;
use App\Models\Notification;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $this->authorize('viewAny', Order::class);

        $now = Carbon::now();
        $currentWindowStart = $now->copy()->subDays(30);
        $previousWindowStart = $now->copy()->subDays(60);

        $activeOrdersQuery = Order::query()
            ->where('status', Order::STATUS_ACTIVE)
            ->whereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') NOT IN ('cancelado','suspenso')");

        $activeSubscribers = (clone $activeOrdersQuery)->count();
        $mrr = (float) (clone $activeOrdersQuery)->sum(DB::raw('COALESCE(amount, 0)'));

        $newCurrent = (clone $activeOrdersQuery)
            ->where('created_at', '>=', $currentWindowStart)
            ->count();

        $newPrevious = Order::query()
            ->where('status', Order::STATUS_ACTIVE)
            ->whereBetween('created_at', [$previousWindowStart, $currentWindowStart])
            ->count();

        $cancelCurrent = ActionLog::query()
            ->where('action', 'cancelado')
            ->where('created_at', '>=', $currentWindowStart)
            ->count();

        $cancelPrevious = ActionLog::query()
            ->where('action', 'cancelado')
            ->whereBetween('created_at', [$previousWindowStart, $currentWindowStart])
            ->count();

        $churnRate = $cancelCurrent > 0
            ? round(($cancelCurrent / max($activeSubscribers + $cancelCurrent, 1)) * 100, 2)
            : 0.0;

        $previousChurnRate = $cancelPrevious > 0
            ? round(($cancelPrevious / max($activeSubscribers + $cancelPrevious, 1)) * 100, 2)
            : 0.0;

        $newDeltaPercent = $newPrevious === 0
            ? ($newCurrent > 0 ? 100.0 : 0.0)
            : round((($newCurrent - $newPrevious) / max($newPrevious, 1)) * 100, 2);

        $churnDeltaPercent = $previousChurnRate === 0.0
            ? ($churnRate > 0 ? 100.0 : 0.0)
            : round((($churnRate - $previousChurnRate) / max($previousChurnRate, 1)) * 100, 2);

        $mrrGained = Order::query()
            ->where('status', Order::STATUS_ACTIVE)
            ->where('created_at', '>=', $currentWindowStart)
            ->sum(DB::raw('COALESCE(amount, 0)'));

        $mrrLost = ActionLog::query()
            ->where('action', 'cancelado')
            ->where('actions_log.created_at', '>=', $currentWindowStart)
            ->join('orders', 'orders.id', '=', 'actions_log.order_id')
            ->sum(DB::raw('COALESCE(orders.amount, 0)'));

        $mrrDeltaValue = (float) round($mrrGained - $mrrLost, 2);
        $previousMrr = $mrr - $mrrDeltaValue;
        $mrrDeltaPercent = $previousMrr <= 0
            ? ($mrr > 0 ? 100.0 : 0.0)
            : round(($mrrDeltaValue / max($previousMrr, 1)) * 100, 2);

        $planBreakdown = (clone $activeOrdersQuery)
            ->select('products_id', DB::raw('COUNT(*) as total_active'), DB::raw('SUM(COALESCE(amount, 0)) as total_amount'))
            ->groupBy('products_id')
            ->with('product:id,name')
            ->get()
            ->map(function (Order $order) use ($activeSubscribers) {
                $planName = optional($order->product)->name ?? 'Plano não informado';
                $active = (int) ($order->total_active ?? 0);
                $revenue = (float) ($order->total_amount ?? 0);

                return [
                    'product_id' => $order->products_id,
                    'product_name' => $planName,
                    'active' => $active,
                    'revenue' => $revenue,
                    'share' => $activeSubscribers > 0
                        ? round(($active / $activeSubscribers) * 100, 1)
                        : 0.0,
                ];
            })
            ->sortByDesc('active')
            ->values();

        $activityLogs = ActionLog::query()
            ->with([
                'order:id,users_id,products_id',
                'order.user:id,name,email',
                'order.product:id,name',
            ])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(function (ActionLog $log) {
                $timestamp = $log->created_at ? Carbon::parse($log->created_at) : null;
                $customer = optional($log->order?->user)->name;
                $plan = optional($log->order?->product)->name;

                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'title' => $this->formatActivityTitle($log->action),
                    'description' => $this->formatActivityDescription($customer, $plan, $log->reason),
                    'occurred_at' => $timestamp?->toIso8601String(),
                    'relative_time' => $timestamp?->diffForHumans(),
                    'order_id' => $log->order_id,
                    'user_id' => $log->user_id,
                    'product_id' => $log->product_id,
                ];
            })
            ->values();

        $demoPending = DemoSignupRequest::query()->whereNull('completed_at')->count();

        $separationBacklog = Order::query()
            ->select('separation_status', DB::raw('COUNT(*) as total'))
            ->whereIn('separation_status', [
                Order::SEPARATION_STATUS_PENDING,
                Order::SEPARATION_STATUS_IN_PROGRESS,
            ])
            ->groupBy('separation_status')
            ->pluck('total', 'separation_status');

        $notificationsUnread = Notification::query()->whereNull('read_at')->count();

        return response()->json([
            'generated_at' => $now->toIso8601String(),
            'metrics' => [
                'activeSubscribers' => [
                    'value' => $activeSubscribers,
                    'netChange' => $newCurrent - $cancelCurrent,
                ],
                'newSubscribers30d' => [
                    'value' => $newCurrent,
                    'previous' => $newPrevious,
                    'deltaPercent' => $newDeltaPercent,
                ],
                'churnRate30d' => [
                    'value' => $churnRate,
                    'previous' => $previousChurnRate,
                    'deltaPercent' => $churnDeltaPercent,
                    'cancellations' => $cancelCurrent,
                ],
                'monthlyRecurringRevenue' => [
                    'value' => round($mrr, 2),
                    'deltaValue' => $mrrDeltaValue,
                    'deltaPercent' => $mrrDeltaPercent,
                ],
            ],
            'activities' => $activityLogs,
            'planPerformance' => [
                'totalActive' => $activeSubscribers,
                'plans' => $planBreakdown,
            ],
            'health' => [
                'demoPending' => [
                    'count' => $demoPending,
                ],
                'separationBacklog' => [
                    'pending' => (int) ($separationBacklog[Order::SEPARATION_STATUS_PENDING] ?? 0),
                    'in_progress' => (int) ($separationBacklog[Order::SEPARATION_STATUS_IN_PROGRESS] ?? 0),
                ],
                'unreadNotifications' => [
                    'count' => $notificationsUnread,
                ],
            ],
        ]);
    }

    private function formatActivityTitle(?string $action): string
    {
        return match ($action) {
            'cancelado' => 'Assinatura cancelada',
            'suspenso' => 'Assinatura suspensa',
            'reativado' => 'Assinatura reativada',
            'aprovado', 'ativo' => 'Assinatura aprovada',
            default => $action ? Str::headline($action) : 'Atualização',
        };
    }

    private function formatActivityDescription(?string $customer, ?string $plan, ?string $reason): string
    {
        $parts = [];
        if ($customer) {
            $parts[] = $customer;
        }
        if ($plan) {
            $parts[] = 'Plano: ' . $plan;
        }
        if ($reason) {
            $parts[] = 'Motivo: ' . $reason;
        }

        return implode(' · ', $parts) ?: 'Log de atividade';
    }
}
