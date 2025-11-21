<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeparationResource;
use App\Models\ActionLog;
use App\Models\Order;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use App\Services\Shipping\ShippingProviderFake;

class SeparationController extends Controller
{
    public function __construct()
    {
        // A autorizacao continua sendo feita dentro de cada metodo para permitir regras especificas.
    }

    /**
     * Retorna assinaturas ativas com preparos de envio nos proximos 15 dias.
     * Mantido como estava para preservar compatibilidade, inclusive com as consultas existentes.
     */
    public function pending(Request $request): \Illuminate\Http\JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        $today = Carbon::today();
        $windowEnd = $today->copy()->addDays(15);

        $referenceDate = $today->toDateString();
        $monthsDiffSql = "TIMESTAMPDIFF(MONTH, orders.created_at, '{$referenceDate}')";
        $baseShipmentSql = "DATE_ADD(orders.created_at, INTERVAL {$monthsDiffSql} MONTH)";
        $nextShipmentSql = "CASE WHEN {$baseShipmentSql} < '{$referenceDate}' THEN DATE_ADD({$baseShipmentSql}, INTERVAL 1 MONTH) ELSE {$baseShipmentSql} END";
        $babyAgeOnShipmentSql = "TIMESTAMPDIFF(MONTH, children.birth, {$nextShipmentSql})";

        $pendingQuery = Order::query()
            ->join('users', 'orders.users_id', '=', 'users.id')
            ->leftJoin('children', 'children.users_id', '=', 'users.id')
            ->leftJoin('products as plan_products', 'plan_products.id', '=', 'orders.products_id')
            ->select([
                'orders.id',
                'orders.users_id',
                'orders.products_id',
                'orders.created_at',
                DB::raw("{$nextShipmentSql} as next_shipment_date"),
                DB::raw("{$babyAgeOnShipmentSql} as baby_age_months"),
                'users.name as subscriber_name',
                'users.email as subscriber_email',
                'plan_products.name as plan_name',
                'children.name as baby_name',
                'children.birth as baby_birth_date',
            ])
            ->where('orders.status', Order::STATUS_ACTIVE)
            ->whereNotNull('children.birth')
            ->whereBetween(DB::raw($nextShipmentSql), [
                $referenceDate,
                $windowEnd->toDateString(),
            ])
            ->whereBetween(DB::raw("{$babyAgeOnShipmentSql}"), [0, 24]) // Limite de 24 meses (padronizado)
            ->distinct()
            ->orderBy(DB::raw($nextShipmentSql));

        $pending = $pendingQuery->get();

        // Agrupa por assinatura + bebê (id do pedido + nome + nascimento do bebê) para evitar duplicidade real
        $data = $pending
            ->map(function ($item) {
                $nextShipment = Carbon::parse($item->next_shipment_date);
                $createdAt = Carbon::parse($item->created_at);
                $babyBirth = $item->baby_birth_date ? Carbon::parse($item->baby_birth_date) : null;
                $ageMonths = $babyBirth ? $babyBirth->diffInMonths($nextShipment) : null;

                // Buscar brinquedo correspondente à idade usando cache no Model Product (evita N+1)
                $brinquedo = null;
                if ($ageMonths !== null) {
                    $brinquedo = \App\Models\Product::matchByAge((int) $ageMonths);
                }

                return [
                    'subscription_id' => $item->id,
                    'subscriber_id' => $item->users_id,
                    'subscriber_name' => $item->subscriber_name,
                    'subscriber_email' => $item->subscriber_email,
                    'plan_id' => $item->products_id,
                    'plan_name' => $item->plan_name,
                    'baby_name' => $item->baby_name,
                    'baby_birthdate' => $babyBirth?->toDateString(),
                    'baby_age_months' => $ageMonths,
                    'next_shipment_date' => $nextShipment->toDateString(),
                    'created_at' => $createdAt->toDateString(),
                    'brinquedo' => $brinquedo ? [
                        'id' => $brinquedo->id,
                        'name' => $brinquedo->name,
                    ] : null,
                ];
            })
            ->unique(function ($item) {
                return $item['subscription_id'] . '_' . ($item['baby_name'] ?? '') . '_' . ($item['baby_birthdate'] ?? '');
            })
            ->values();

        return response()->json([
            'data' => $data,
            'count' => $data->count(),
            'generated' => $today->toDateString(),
            'window_end' => $windowEnd->toDateString(),
        ]);
    }

    /**
     * Lista as assinaturas para a visao principal (Kanban/Lista), com filtro por plano e janela de datas,
     * utilizando apenas Eloquent e calculos em PHP para evitar SQL bruto complexo.
     */
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Order::class);

        $planFilter = Str::slug($request->query('plan', 'todos'));
        $dateFilter = $request->query('date', 'proximos-15-dias');
        $recentActions = filter_var($request->query('recent_actions', '0'), FILTER_VALIDATE_BOOLEAN);
        $perPage = max((int) $request->query('per_page', 20), 1);
        $currentPage = max((int) $request->query('page', 1), 1);
        $quickSearch = trim((string) $request->query('q', ''));
        $orderParam = trim((string) $request->query('order', ''));
        $productParam = trim((string) $request->query('product', ''));
        $babyParam = trim((string) $request->query('baby', ''));
        $motherParam = trim((string) $request->query('mother', ''));

        $referenceDate = Carbon::today();
        $windowEndDate = $referenceDate->copy()->addDays(15);

        $ordersQuery = Order::query()
            ->with([
                'user:id,name,email',
                'user.children' => function ($query) {
                    $query->orderByDesc('id');
                },
                'product:id,name,plan_vindi',
            ])
            ->withCount(['actionLogs as label_generated_count' => function ($q) {
                $q->where('action', 'generate_label');
            }])
            ->withMax(['actionLogs as last_label_generated_at' => function ($q) {
                $q->where('action', 'generate_label');
            }], 'created_at')
            ->withMax(['actionLogs as last_reset_at' => function ($q) {
                $q->where('action', 'like', 'separation_status_aguardando_separacao%');
            }], 'created_at')
            ->where('status', Order::STATUS_ACTIVE)
            ->whereHas('user.children', function ($query) {
                $query->whereNotNull('birth');
            });

        // Busca unificada: nome da mãe, nome da criança, nome do produto/plano, nome do brinquedo
        if ($quickSearch !== '') {
            $ordersQuery->where(function ($query) use ($quickSearch) {
                $term = $quickSearch;
                $digits = preg_replace('/[^0-9]/', '', $term);

                // If the term looks like an order id (numeric and not too long), match by orders.id
                if (ctype_digit($digits) && strlen($digits) <= 8 && $digits !== '') {
                    $query->orWhere('orders.id', (int)$digits);
                }

                // Nome/email/CPF da mãe
                $query->orWhereHas('user', function ($q) use ($term, $digits) {
                    $q->where(function ($qq) use ($term, $digits) {
                        if (str_contains($term, '@')) {
                            $qq->where('email', 'like', '%'.$term.'%');
                        } elseif (strlen($digits) === 11) {
                            $qq->whereRaw("REPLACE(REPLACE(REPLACE(document, '.', ''), '-', ''), '/', '') = ?", [$digits]);
                        } else {
                            $qq->where('name', 'like', '%'.$term.'%');
                        }
                    });
                });

                // Nome da criança
                $query->orWhereHas('user.children', function ($q) use ($term) {
                    $q->where('name', 'like', '%'.$term.'%');
                });

                // Nome do produto/plano
                $query->orWhereHas('product', function ($q) use ($term) {
                    $q->where('name', 'like', '%'.$term.'%');
                });

                // Busca por status da separação (label)
                $query->orWhere('orders.separation_status', 'like', '%'.$term.'%');

                // Busca por ações (action logs)
                $query->orWhereHas('actionLogs', function ($q) use ($term) {
                    $q->where('action', 'like', '%'.$term.'%');
                });
            });
        }

        // Filtro por número do pedido
        if ($orderParam !== '') {
            $ordersQuery->where('orders.id', $orderParam);
        }

        // Filtro por nome do produto (plano)
        $filterByPlan = false;
        if ($productParam !== '') {
            $filterByPlan = true;
            $ordersQuery->whereHas('product', function ($q) use ($productParam) {
                $q->where('name', 'like', '%'.$productParam.'%');
            });
        }

        // Filtro por nome da criança (filho)
        if ($babyParam !== '') {
            $ordersQuery->whereHas('user.children', function ($q) use ($babyParam) {
                $q->where('name', 'like', '%'.$babyParam.'%');
            });
        }

        // Filtro por nome da mãe (usuário)
        if ($motherParam !== '') {
            $ordersQuery->whereHas('user', function ($q) use ($motherParam) {
                $q->where('name', 'like', '%'.$motherParam.'%');
            });
        }

        if (in_array($planFilter, ['evolua-petit', 'evolua-bebe'], true)) {
            $needle = $planFilter === 'evolua-petit' ? 'petit' : 'beb';
            $ordersQuery->whereHas('product', function ($query) use ($needle) {
                $query->where(function ($inner) use ($needle) {
                    $inner->where('plan_vindi', 'like', "%{$needle}%")
                        ->orWhere('name', 'like', "%{$needle}%");
                });
            });
        }

    $orders = $ordersQuery->get();

    // Detect numeric search (possible order id) to allow including the order
    $searchDigits = preg_replace('/[^0-9]/', '', $quickSearch);
    $isNumericSearch = ctype_digit($searchDigits) && strlen($searchDigits) <= 8 && $searchDigits !== '';

        // Carrega última ação por pedido para alinhar com a lógica do Perfil (cancelado/suspenso)
        $orderIds = $orders->pluck('id')->all();
        $lastActionsMap = collect();
        if (!empty($orderIds)) {
            $latestIds = \App\Models\ActionLog::query()
                ->select('order_id', DB::raw('MAX(id) as max_id'))
                ->whereIn('order_id', $orderIds)
                ->groupBy('order_id')
                ->get()
                ->pluck('max_id', 'order_id');

            if ($latestIds->isNotEmpty()) {
                $actions = \App\Models\ActionLog::query()
                    ->whereIn('id', $latestIds->values())
                    ->get(['id','order_id','action'])
                    ->keyBy('order_id');
                $lastActionsMap = $actions->map(fn($r) => (string) ($r->action ?? ''));
            }
        }

        $filtered = $orders
            ->map(function (Order $order) use ($referenceDate, $windowEndDate, $dateFilter, $lastActionsMap, $isNumericSearch, $searchDigits) {
                // Exclui pedidos cuja última ação indica cancelamento/suspensão
                $lastAction = strtolower((string) ($lastActionsMap->get($order->id) ?? ''));
                if (in_array($lastAction, ['cancelado','suspenso'], true)) {
                    return null;
                }
                $nextShipment = $this->calculateNextShipmentDate($order, $referenceDate);
                // If this is a numeric search by id, allow including the order even if next shipment is not available
                if (! $nextShipment && ! $isNumericSearch) {
                    return null;
                }

                $order->setAttribute('next_shipment_date', $nextShipment);

                $latestChild = $this->resolveLatestChild($order);
                if ((! $latestChild || ! $latestChild->birth) && ! $isNumericSearch) {
                    return null;
                }

                $babyAgeMonths = null;
                if ($latestChild && $latestChild->birth && $nextShipment) {
                    $babyAgeMonths = Carbon::parse($latestChild->birth)->diffInMonths($nextShipment);
                }
                if (($babyAgeMonths === null || $babyAgeMonths < 0 || $babyAgeMonths > 24) && ! $isNumericSearch) {
                    return null;
                }

                if ($dateFilter === 'proximos-15-dias' && $nextShipment && ($nextShipment->lt($referenceDate) || $nextShipment->gt($windowEndDate)) && ! $isNumericSearch) {
                    return null;
                }

                $order->setAttribute('baby_age_months', $babyAgeMonths);
                $order->setRelation('latest_child', $latestChild);

                return $order;
            })
            ->filter()
            // Filtro extra: produto_to_send (brinquedo) pelo nome, se solicitado OU busca unificada
            ->when($productParam !== '' || $quickSearch !== '', function ($collection) use ($productParam, $filterByPlan, $quickSearch) {
                if ($productParam === '' && $quickSearch !== '') {
                    return $collection;
                }

                $term = $productParam !== '' ? $productParam : $quickSearch;

                return $collection->filter(function ($order) use ($term, $filterByPlan) {
                    if ($filterByPlan && $order->relationLoaded('product') && stripos(optional($order->product)->name, $term) !== false) {
                        return true;
                    }

                    $babyAgeMonths = $order->baby_age_months ?? null;
                    if ($babyAgeMonths !== null) {
                        $brinquedo = \App\Models\Product::matchByAge((int) $babyAgeMonths);
                        if ($brinquedo && stripos($brinquedo->name, $term) !== false) {
                            return true;
                        }
                    }

                    return false;
                });
            })
            // Evita duplicatas no retorno (um card por assinatura)
            ->unique(function (Order $order) {
                return $order->id;
            })
            ->sortBy(function (Order $order) {
                return $order->getAttribute('next_shipment_date');
            })
            ->values();

        // Filtro opcional: Ações recentes (ex.: últimas 72h)
        if ($recentActions && $filtered->isNotEmpty()) {
            $hours = 24; // janela de "recentes" (1 dia)
            $orderIds = $filtered->pluck('id')->all();
            $recentMap = ActionLog::query()
                ->select('order_id', DB::raw('MAX(created_at) as last_action_at'))
                ->whereIn('order_id', $orderIds)
                ->where('created_at', '>=', now()->subHours($hours))
                ->groupBy('order_id')
                ->get()
                ->keyBy('order_id');

            // Mantém somente pedidos com ação recente
            $filtered = $filtered->filter(function (Order $order) use ($recentMap) {
                return $recentMap->has($order->id);
            })->values();

            // Ordena por data da última ação desc
            $filtered = $filtered->sortByDesc(function (Order $order) use ($recentMap) {
                return optional($recentMap->get($order->id))->last_action_at;
            })->values();
        }

        $total = $filtered->count();
        $results = $filtered->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginator = new LengthAwarePaginator(
            $results,
            $total,
            $perPage,
            $currentPage,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return SeparationResource::collection($paginator);
    }

    /**
     * Atualiza o status de uma separacao (pedido) recebendo um CODIGO.
     */
    public function updateStatus(Request $request, Order $order): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $order);

        $admin = $request->user();

        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(array_keys(Order::separationStatusMap()))],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $statusCode = $data['status'];
        $notes = $data['notes'] ?? null;

        $statusMap = Order::separationStatusMap();
        $newStatusLabel = $statusMap[$statusCode];

        $previousStatus = Order::normalizeSeparationStatus($order->separation_status);

        if ($previousStatus === $newStatusLabel) {
            return response()->json(['message' => 'Status da separacao permanece inalterado.']);
        }

        DB::transaction(function () use ($order, $admin, $newStatusLabel, $notes, $previousStatus) {
            $order->update(['separation_status' => $newStatusLabel]);

            $reason = $notes
                ? sprintf('Status alterado de %s para %s. Observacao: %s', $previousStatus, $newStatusLabel, $notes)
                : sprintf('Status alterado de %s para %s', $previousStatus, $newStatusLabel);

            ActionLog::create([
                'order_id' => $order->id,
                'product_id' => $order->products_id,
                'user_id' => $order->users_id,
                'action' => 'separation_status_'.Str::slug($newStatusLabel, '_'),
                'quantity' => null,
                'reason' => $reason,
                'action_by' => $admin->id,
            ]);

            // Criar notificação administrativa para alteração de estágio de separação.
            // Isso garante que o NotificationBell e outros consumidores recebam um alerta
            // quando o status de separação for alterado.
            try {
                Notification::create([
                    'user_id' => null,
                    'type' => 'separation_status_changed',
                    'title' => sprintf('Status de separação alterado: %s', $newStatusLabel),
                    'body' => sprintf('Pedido #%d alterado de "%s" para "%s".', $order->id, $previousStatus, $newStatusLabel),
                    'data' => [
                        'order_id' => $order->id,
                        'user_id' => $order->users_id,
                        'new_status' => $newStatusLabel,
                    ],
                ]);
            } catch (\Throwable $e) {
                // Não interromper o fluxo de atualização se a criação da notificação falhar.
            }
        });

        $order->refresh();

        return response()->json([
            'order' => $order,
            'message' => 'Status atualizado com sucesso!'
        ]);
    }

    /**
     * Gera etiqueta de envio (provider fake) e move o pedido para "Pendente de Envio".
     * Regras de segurança: authorize + validação de endereço + bloqueio se já enviado.
     */
    public function generateLabel(Request $request, Order $order): JsonResponse
    {
        $this->authorize('update', $order);

        $admin = $request->user();

        // Bloqueia geração de etiqueta para pedidos inativos
        if (strtolower((string) $order->status) !== strtolower(Order::STATUS_ACTIVE)) {
            return response()->json([
                'message' => 'Não é possível gerar etiqueta: assinatura inativa.'
            ], 422);
        }

        // Bloqueia também se a última ação registrada indica cancelamento/suspensão
        $lastAction = \App\Models\ActionLog::query()
            ->where('order_id', $order->id)
            ->orderByDesc('id')
            ->value('action');
        $lastActionNorm = strtolower((string) $lastAction);
        if (in_array($lastActionNorm, ['cancelado','suspenso'], true)) {
            return response()->json([
                'message' => 'Não é possível gerar etiqueta: assinatura cancelada/suspensa.'
            ], 422);
        }

        $current = Order::normalizeSeparationStatus($order->separation_status);
        $isAlreadyShipped = strtolower($current) === strtolower(Order::SEPARATION_STATUS_SHIPPED);

        // Regra: etiqueta é considerada "gerada" apenas se houver um log de generate_label
        // que ocorreu depois do último reset para "Aguardando Separação".
        // Isso permite re-gerar a etiqueta se houver um reset (fluxo reiniciado).
        $lastGen = ActionLog::query()
            ->where('order_id', $order->id)
            ->where('action', 'generate_label')
            ->max('created_at');

        $lastReset = ActionLog::query()
            ->where('order_id', $order->id)
            ->where('action', 'like', 'separation_status_aguardando_separacao%')
            ->max('created_at');

        $isAtFirstStage = strtolower($current) === strtolower(Order::SEPARATION_STATUS_PENDING);

        // Já gerada e ainda válida (última geração posterior ao último reset ou nenhum reset)
        $alreadyGeneratedAndNotReset = $lastGen !== null && ($lastReset === null || $lastGen > $lastReset);

        if ($alreadyGeneratedAndNotReset && ! $isAtFirstStage) {
            return response()->json([
                'message' => 'Etiqueta já gerada para este pedido. Para gerar novamente, retorne ao primeiro estágio.'
            ], 409);
        }

        $address = $this->resolveShippingAddress($order);
        $this->validateShippingAddressOrFail($address);

        $provider = new ShippingProviderFake();
        $label = $provider->createShipment($order);

        // Se já está Enviado/Coletado, apenas gera etiqueta e loga, sem alterar status
        if ($isAlreadyShipped) {
            ActionLog::create([
                'order_id' => $order->id,
                'product_id' => $order->products_id,
                'user_id' => $order->users_id,
                'action' => 'generate_label',
                'quantity' => null,
                'reason' => sprintf('Etiqueta gerada em status atual: %s', $current),
                'action_by' => $admin->id,
            ]);
        } else {
            $newStatus = Order::SEPARATION_STATUS_READY; // Pendente de Envio
            DB::transaction(function () use ($order, $admin, $current, $newStatus) {
                $order->update(['separation_status' => $newStatus]);

                ActionLog::create([
                    'order_id' => $order->id,
                    'product_id' => $order->products_id,
                    'user_id' => $order->users_id,
                    'action' => 'separation_status_' . Str::slug($newStatus, '_'),
                    'quantity' => null,
                    'reason' => sprintf('Etiqueta gerada. Status alterado de %s para %s', $current, $newStatus),
                    'action_by' => $admin->id,
                ]);
                // Marca explicitamente geração de etiqueta para controle de idempotência
                ActionLog::create([
                    'order_id' => $order->id,
                    'product_id' => $order->products_id,
                    'user_id' => $order->users_id,
                    'action' => 'generate_label',
                    'quantity' => null,
                    'reason' => 'Etiqueta gerada',
                    'action_by' => $admin->id,
                ]);
            });
        }

        // Monta label_url com dados do destinatário para exibir na prévia
        $recipient = [
            'name' => $address['name'] ?? optional($order->user)->name,
            'zip' => $address['zip'] ?? null,
            'street' => $address['street'] ?? null,
            'number' => $address['number'] ?? null,
            'city' => $address['city'] ?? null,
            'state' => $address['state'] ?? null,
        ];
        $qs = http_build_query(array_filter([
            'tracking' => $label['tracking_code'] ?? null,
            'name' => $recipient['name'] ?? null,
            'zip' => $recipient['zip'] ?? null,
            'street' => $recipient['street'] ?? null,
            'number' => $recipient['number'] ?? null,
            'city' => $recipient['city'] ?? null,
            'state' => $recipient['state'] ?? null,
        ]));
        $label['label_url'] = url('/labels/preview') . '?' . $qs;

        return response()->json($label);
    }

    /**
     * Resolve endereço de entrega a partir do pedido ou do usuário (fallback).
     */
    private function resolveShippingAddress(Order $order): ?array
    {
        $o = $order->toArray();
        $maybe = [
            'name'   => $o['shipping_name']   ?? null,
            'zip'    => $o['shipping_zip']    ?? null,
            'street' => $o['shipping_street'] ?? null,
            'number' => $o['shipping_number'] ?? null,
            'city'   => $o['shipping_city']   ?? null,
            'state'  => $o['shipping_state']  ?? null,
            'phone'  => $o['shipping_phone']  ?? null,
            'email'  => $o['shipping_email']  ?? null,
        ];

        $hasCore = !empty($maybe['zip']) && !empty($maybe['street']) && !empty($maybe['number']) && !empty($maybe['city']) && !empty($maybe['state']);
        if ($hasCore) {
            if (empty($maybe['name'])) {
                $maybe['name'] = optional($order->user)->name;
            }
            return $maybe;
        }

        $user = $order->user()->first();
        if ($user) {
            return [
                'name'   => $user->name,
                'zip'    => $user->cep,
                'street' => $user->address,
                'number' => $user->number,
                'city'   => $user->city,
                'state'  => $user->state,
                'phone'  => $user->phone,
                'email'  => $user->email,
            ];
        }

        return null;
    }

    /**
     * Valida endereço mínimo para geração de etiqueta (CEP, rua, número, cidade, UF).
     */
    private function validateShippingAddressOrFail(?array $address): void
    {
        if (! $address) {
            abort(response()->json(['message' => 'Endereço de entrega não encontrado.'], 422));
        }

        foreach (['zip','street','number','city','state'] as $key) {
            if (! filled($address[$key] ?? null)) {
                abort(response()->json(['message' => "Endereço incompleto: faltando {$key}."], 422));
            }
        }

        $zip = preg_replace('/[^0-9]/', '', (string) $address['zip']);
        if (strlen($zip) !== 8) {
            abort(response()->json(['message' => 'CEP inválido.'], 422));
        }
    }

    private function formatCep(?string $zip): ?string
    {
        if (! $zip) { return null; }
        $digits = preg_replace('/[^0-9]/', '', $zip);
        if (strlen($digits) !== 8) { return $zip; }
        return substr($digits, 0, 5) . '-' . substr($digits, 5, 3);
    }

    private function composeAddressLine(?string $street, ?string $number, ?string $neighborhood, ?string $complete, ?string $city, ?string $state): ?string
    {
        if (! $street && ! $city) { return null; }
        $parts = [];
        if ($street) {
            $parts[] = trim($street . (isset($number) && $number !== '' ? ', '.$number : ''));
        }
        if ($neighborhood) { $parts[] = $neighborhood; }
        if ($complete) { $parts[] = $complete; }
        $cityState = trim(($city ?? '') . (isset($state) && $state !== '' ? ' - '.$state : ''));
        if ($cityState !== '') { $parts[] = $cityState; }
        return implode(' — ', array_filter($parts, fn($v) => $v !== null && $v !== ''));
    }

    /**
     * Calcula a próxima data de envio mensal a partir da data de criação do pedido
     * sem voltar no tempo em relação à data de referência.
     */
    private function calculateNextShipmentDate(Order $order, Carbon $referenceDate): ?Carbon
    {
        if (! $order->created_at) {
            return null;
        }

        $createdAt = Carbon::parse($order->created_at);

        // Meses completos entre a criação e a referência (pode ser 0)
        $monthsDiff = $createdAt->diffInMonths($referenceDate, false);
        if ($monthsDiff < 0) {
            $monthsDiff = 0;
        }

        $base = $createdAt->copy()->addMonths($monthsDiff);
        if ($base->lt($referenceDate)) {
            $base->addMonth();
        }

        return $base;
    }

    /**
     * Resolve o filho mais recente do assinante para cálculo de idade na data de envio.
     */
    private function resolveLatestChild(Order $order)
    {
        if ($order->relationLoaded('user') && $order->user && $order->user->relationLoaded('children')) {
            $children = $order->user->children;
            if ($children) {
                $children = $children->unique(function ($child) {
                    return ($child->id ?? '') . '|' . ($child->name ?? '') . '|' . ($child->birth ?? '');
                })->values();
                return $children->sortByDesc('id')->first();
            }
        }

        return optional($order->user)->children()->orderByDesc('id')->first();
    }

    /**
     * Histórico de etiquetas geradas (sem persistir arquivos). Lista logs 'generate_label'.
     */
    public function labelHistory(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        $perPage = max((int) $request->query('per_page', 20), 1);
        $page = max((int) $request->query('page', 1), 1);

        $query = ActionLog::query()
            ->where('action', 'generate_label')
            ->orderByDesc('created_at')
            ->with(['order.user']);

        // Filtros por período (opcionais): start_date, end_date (YYYY-MM-DD)
        $start = $request->query('start_date');
        $end = $request->query('end_date');
        if ($start) {
            $query->whereDate('created_at', '>=', $start);
        }
        if ($end) {
            $query->whereDate('created_at', '<=', $end);
        }

        // Filtro por assinante (nome ou email)
        $q = $request->query('q');
        if ($q) {
            $query->whereHas('order.user', function ($sub) use ($q) {
                $sub->where('name', 'like', "%$q%")
                     ->orWhere('email', 'like', "%$q%") ;
            });
        }

        $total = (clone $query)->count();
        $items = $query->forPage($page, $perPage)->get();

        // Carrega última data de reset (volta para Aguardando Separação) por pedido
        $orderIds = $items->pluck('order_id')->filter()->unique()->values();
        $resets = ActionLog::query()
            ->select('order_id', DB::raw('MAX(created_at) as last_reset_at'))
            ->whereIn('order_id', $orderIds)
            ->where('action', 'like', 'separation_status_aguardando_separacao%')
            ->groupBy('order_id')
            ->get()
            ->keyBy('order_id');

        $data = $items->map(function (ActionLog $log) use ($resets) {
            $order = $log->order;
            $user = optional($order)->user;
            $address = $order ? $this->resolveShippingAddress($order) : null;

            // Se houve reset após a geração desta etiqueta, bloquear visualização
            $lastResetAt = optional($resets->get($order->id))->last_reset_at;
            $viewAllowed = !($lastResetAt && $log->created_at && $lastResetAt > $log->created_at);

            $labelUrl = null;
            if ($viewAllowed) {
                $tracking = 'TRK-'.substr(sha1(($order->id ?? '0').'|'.$log->created_at.'|hist'), 0, 10);
                $qs = http_build_query(array_filter([
                    'tracking' => $tracking,
                    'name' => $address['name'] ?? ($user->name ?? null),
                    'zip' => $address['zip'] ?? ($user->cep ?? null),
                    'street' => $address['street'] ?? ($user->address ?? null),
                    'number' => $address['number'] ?? ($user->number ?? null),
                    'city' => $address['city'] ?? ($user->city ?? null),
                    'state' => $address['state'] ?? ($user->state ?? null),
                ]));
                $labelUrl = url('/labels/preview').'?'.$qs;
            }

            return [
                'id' => $log->id,
                'order_id' => $order->id ?? null,
                'subscriber_id' => $order->users_id ?? null,
                'subscriber_name' => $user->name ?? null,
                'created_at' => (string) $log->created_at,
                'view_allowed' => $viewAllowed,
                'label_preview_url' => $labelUrl,
                // Enriquecimento para DEMO local no front
                'cep' => $address['zip'] ?? ($user->cep ?? null),
                'address' => $address['street'] ?? ($user->address ?? null),
                'number' => $address['number'] ?? ($user->number ?? null),
                'neighborhood' => $user->neighborhood ?? null,
                'complete' => $user->complete ?? null,
                'cep_formatted' => $this->formatCep($address['zip'] ?? ($user->cep ?? null)),
                'address_line' => $this->composeAddressLine(
                    $address['street'] ?? ($user->address ?? null),
                    $address['number'] ?? ($user->number ?? null),
                    $user->neighborhood ?? null,
                    $user->complete ?? null,
                    $address['city'] ?? ($user->city ?? null),
                    $address['state'] ?? ($user->state ?? null),
                ),
                'city' => $address['city'] ?? ($user->city ?? null),
                'state' => $address['state'] ?? ($user->state ?? null),
                // Status da etiqueta para a UI: 'cancelada' quando resetou; 'ativa' caso contrário
                'label_status' => $viewAllowed ? 'ativa' : 'cancelada',
                'label_canceled_at' => $viewAllowed ? null : (string) $lastResetAt,
            ];
        });

        $paginator = new LengthAwarePaginator(
            $data,
            $total,
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return response()->json($paginator);
    }

    /**
     * Exibe os detalhes de uma separação específica.
     */
    public function show($id)
    {
        // Busca o pedido com os relacionamentos necessários para o frontend
        $order = Order::with(['user', 'products'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        return response()->json($order);
    }
}
