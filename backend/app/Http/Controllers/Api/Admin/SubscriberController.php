<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Http\Resources\SubscriberResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\DemoSignupRequest;
use App\Models\Product;
use App\Models\ActionLog;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use App\Services\Subscribers\OrderProvisioner;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SubscriberController extends Controller
{
    /**
     * GET /api/admin/subscribers/search?q=texto
     * Compatibilidade: alias para `searchLite` para que chamadas a `/subscribers/search`
     * sejam atendidas quando o frontend esperar o método `search`.
     */
    public function search(Request $request)
    {
        return $this->searchLite($request);
    }

    /**
     * GET /api/admin/subscribers/search?q=texto
     * Busca assinantes para autocomplete (nome/email), retornando lista enxuta.
     * Inclui usuários com pedidos (ativos/qualquer) e também pendentes (sem pedidos), limitando o resultado.
     */
    public function searchLite(Request $request)
    {
        // Log para debug: confirmar que o endpoint foi invocado e qual termo foi passado
        Log::info('Endpoint de busca /searchLite foi chamado. Termo: ' . $request->query('q', 'NENHUM'));
        
        $this->authorize('viewAny', Order::class);

        $q = trim((string) $request->query('q', ''));
        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $limit = (int) $request->query('limit', 15);

        // 1) Assinantes com pedidos: pega usuários distintos com match em name/email
        $usersFromOrders = User::query()
            ->select(['users.id', 'users.name', 'users.email'])
            ->join('orders', 'orders.users_id', '=', 'users.id')
            ->where(function ($w) use ($q) {
                $w->where('users.name', 'like', "%{$q}%")
                  ->orWhere('users.email', 'like', "%{$q}%");
            })
            ->groupBy('users.id', 'users.name', 'users.email')
            ->limit($limit)
            ->get();

        // 2) Pendentes (sem pedido): usuários sem orders que batem com o termo
        $pendingUsers = User::query()
            ->select(['users.id', 'users.name', 'users.email'])
            ->whereDoesntHave('orders')
            ->where(function ($w) use ($q) {
                $w->where('users.name', 'like', "%{$q}%")
                  ->orWhere('users.email', 'like', "%{$q}%");
            })
            ->limit(max(0, $limit - $usersFromOrders->count()))
            ->get();

        // Merge e dedup por id
        $merged = $usersFromOrders->concat($pendingUsers)
            ->unique('id')
            ->take($limit)
            ->values()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                ];
            });

        // Log de debug: quantidades retornadas por cada etapa para validar lógica
        try {
            $countOrders = is_countable($usersFromOrders) ? count($usersFromOrders) : $usersFromOrders->count();
            $countPending = is_countable($pendingUsers) ? count($pendingUsers) : $pendingUsers->count();
            $countMerged = is_countable($merged) ? count($merged) : $merged->count();
            Log::info(sprintf('searchLite debug - termo="%s" limit=%d usersFromOrders=%d pendingUsers=%d merged=%d', $q, $limit, $countOrders, $countPending, $countMerged));
        } catch (\Throwable $e) {
            // Não interromper a resposta por causa do log
            Log::error('searchLite debug log failed: ' . $e->getMessage());
        }

        return response()->json(['data' => $merged]);
    }

    

    // Rota pública temporária removida após validação
    /**
     * GET /api/admin/subscribers/{id}
     * Retorna detalhes do assinante por order_id (ativos/cancelados) ou user_id (pendentes).
     */
    public function show($id)
    {
        // Tenta buscar por Order (assinante ativo/cancelado)
        $order = Order::with([
                'user:id,name,email,phone,document,address,number,city,state',
                // Corrige nomes de colunas da relação children: users_id e birth
                'user.children:id,users_id,name,birth',
                'product:id,name'
            ])
            ->where('id', $id)
            ->first();

        if ($order) {
            $this->authorize('view', $order);

            // Obtém a última ação registrada para refletir status corretamente
            $lastLog = $order->actionLogs()
                ->orderByDesc('created_at')
                ->select('action', 'reason', 'created_at')
                ->first();
            if ($lastLog) {
                $order->last_action = $lastLog->action;
                $order->last_reason = $lastLog->reason;
                $order->last_action_at = $lastLog->created_at;
            }

            return new SubscriberResource($order);
        }

        // Se não encontrou Order, tenta buscar User pendente (sem assinatura)
        $user = User::with('children')->where('id', $id)->first();
        if ($user && !$user->orders()->exists()) {
            $this->authorize('view', $user);
            $demoRequest = DemoSignupRequest::query()
                ->where('user_id', $user->id)
                ->whereNull('completed_at')
                ->latest('id')
                ->first();
            $defaultProductId = (int) (config('services.subscribers.default_product_id') ?? 0);
            $defaultAmount = (float) (config('services.subscribers.default_amount') ?? 0);
            $defaultProduct = $defaultProductId ? Product::query()->select('id','name')->find($defaultProductId) : null;
            if (! $defaultProduct && ! $defaultProductId) {
                $defaultProduct = Product::query()->select('id','name')->orderBy('id')->first();
            }
            $planId = $demoRequest?->products_id ?: ($defaultProduct?->id ?? null);
            $planName = '—';
            if ($planId) {
                if ($demoRequest && $demoRequest->products_id) {
                    $planName = Product::query()->whereKey($planId)->value('name') ?? ($defaultProduct?->name ?? 'Plano Padrão');
                } else {
                    $planName = $defaultProduct?->name ?? 'Plano Padrão';
                }
            }
            $amount = $demoRequest && $demoRequest->amount !== null ? (float) $demoRequest->amount : $defaultAmount;
            $assinante = [
                'id' => null,
                'order_id' => null,
                'user_id' => $user->id,
                'name' => $user->name,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'plan_id' => null,
                'plan_name' => '—',
                'subscription_date' => null,
                'order_status' => null,
                'gateway_status' => null,
                'status_code' => 'pending',
                'status_label' => 'PENDENTE',
                'last_reason' => null,
                'last_action_at' => null,
                // Dados pessoais
                'email' => $user->email,
                'phone' => $user->phone,
                'document' => $user->document,
                'address' => $user->address,
                'number' => $user->number,
                'city' => $user->city,
                'state' => $user->state,
                // Histórico de pedidos (vazio)
                'orders' => [],
                // Filhos
                'children' => $user->children ?? [],
                'demo_request_id' => $demoRequest?->id,
                'demo_origin' => $demoRequest?->origin,
                'suggested_order_id' => $demoRequest?->suggested_order_id,
                'products_id' => $planId,
                'plan_id' => $planId,
                'plan_name' => $planName,
                'amount' => $amount,
            ];
            return new SubscriberResource($assinante);
        }

        return response()->json(['message' => 'Assinante não encontrado.'], 404);
    }

    /**
     * GET /api/admin/subscribers
     * Lista os assinantes (pedidos) com filtros.
     */
    public function listSubscribers(Request $request)

    {
        // Autoriza visualização de listagem de orders
        $this->authorize('viewAny', Order::class);

        $limit = (int) $request->query('limit', 15);
        $status = trim((string) $request->query('status', 'todos'));
        $search = trim((string) $request->query('search', ''));
        // Tenta normalizar o termo de busca para data (para buscar por nascimento dos filhos)
        $searchDate = null;
        if ($search !== '') {
            // Formatos aceitos: dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd
            if (preg_match('/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/', $search, $m)) {
                // dd/mm/yyyy -> Y-m-d
                $searchDate = sprintf('%04d-%02d-%02d', (int) $m[3], (int) $m[2], (int) $m[1]);
            } elseif (preg_match('/^(\d{4})[\-](\d{2})[\-](\d{2})$/', $search)) {
                $searchDate = $search;
            }
            // Sanitiza datas inválidas
            if ($searchDate) {
                try {
                    $d = Carbon::parse($searchDate);
                    $searchDate = $d->toDateString();
                } catch (\Throwable $e) {
                    $searchDate = null;
                }
            }
        }

        // Filtro de solicitações (usuários sem assinatura)
        $onlyPending = $request->boolean('only_pending', false) || $status === 'solicitacoes' || $status === 'pendentes';
        if ($onlyPending) {
            $defaultProductId = (int) (config('services.subscribers.default_product_id') ?? 0);
            $defaultAmount = (float) (config('services.subscribers.default_amount') ?? 0);
            $defaultProduct = $defaultProductId ? Product::query()->select('id','name')->find($defaultProductId) : null;
            if (! $defaultProduct && $defaultProductId) {
                $defaultProductId = 0;
            }
            if (! $defaultProduct && ! $defaultProductId) {
                $defaultProduct = Product::query()->select('id','name')->orderBy('id')->first();
                if ($defaultProduct) {
                    $defaultProductId = (int) $defaultProduct->id;
                }
            }
            $defaultPlanName = $defaultProduct->name ?? 'Plano Padrão';

            $usersQ = User::query()
                ->whereDoesntHave('orders')
                ->when($search !== '', function ($q) use ($search, $searchDate) {
                    $q->where(function ($qq) use ($search, $searchDate) {
                        $qq->where('name', 'like', "%{$search}%")
                           ->orWhere('email', 'like', "%{$search}%")
                           ->orWhereHas('children', function ($qc) use ($search, $searchDate) {
                               $qc->where('name', 'like', "%{$search}%");
                               if ($searchDate) {
                                   $qc->orWhereDate('birth', $searchDate);
                               }
                           });
                    });
                });
            $paginator = $usersQ->orderByDesc('id')->paginate($limit)->appends($request->query());

            $pendingUsers = collect($paginator->items());
            $demoRequests = DemoSignupRequest::query()
                ->whereIn('user_id', $pendingUsers->pluck('id'))
                ->whereNull('completed_at')
                ->get()
                ->keyBy('user_id');

            $demoProductIds = $demoRequests->pluck('products_id')->filter()->unique()->all();
            $productsMap = collect();
            if (! empty($demoProductIds)) {
                $productsMap = Product::query()
                    ->select('id','name')
                    ->whereIn('id', $demoProductIds)
                    ->get()
                    ->keyBy('id');
            }

            $data = $pendingUsers->map(function (User $u) use ($defaultProductId, $defaultPlanName, $defaultAmount, $demoRequests, $productsMap) {
                $demo = $demoRequests->get($u->id);
                $planId = $demo?->products_id ?: ($defaultProductId ?: null);
                $planName = $defaultPlanName;
                if ($demo && $demo->products_id) {
                    $planName = optional($productsMap->get($demo->products_id))->name ?? $defaultPlanName;
                } elseif (! $planId) {
                    $planName = '—';
                }
                $amount = $demo && $demo->amount !== null ? (float) $demo->amount : $defaultAmount;

                return [
                    'order_id' => null,
                    'user_id' => $u->id,
                    'user_name' => $u->name,
                    'user_email' => $u->email,
                    'plan_id' => $planId,
                    'plan_name' => $planName,
                    'subscription_date' => null,
                    'order_status' => null,
                    'gateway_status' => null,
                    'status_code' => 'pending',
                    'status_label' => 'PENDENTE',
                    'products_id' => $planId,
                    'amount' => $amount,
                    'last_action' => null,
                    'last_reason' => null,
                    'last_action_at' => null,
                    'demo_request_id' => $demo?->id,
                    'demo_origin' => $demo?->origin,
                    'suggested_order_id' => $demo?->suggested_order_id,
                ];
            })->values();

            return response()->json([
                'data' => $data,
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ]);
        }

        // Deduplica lista de assinantes em 'todos/active' (comportamento atual)
        // e, se "unique=1" for enviado, deduplica por usuário (apenas o pedido mais recente por usuário)
        if ($status === 'todos' || $status === 'active' || $status === '' || $status === null || $status === 'aprovados') {
            $driver = DB::getDriverName();
            $dateExpr = $driver === 'sqlite' ? "strftime('%Y-%m-%d', orders.created_at)" : 'DATE(orders.created_at)';

            $base = Order::query()
                ->where(function ($qq) use ($status) {
                    if ($status === 'aprovados') {
                        $qq->where('orders.status', 'active')
                            ->where('orders.created_at', '>=', now()->subDays(30));
                    } else {
                        $qq->where(function ($qqq) {
                            $qqq->where('orders.status', 'active')
                                ->whereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') NOT IN ('cancelado','suspenso')");
                        })->orWhereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') = 'reativado'");
                    }
                })
                ->when($search !== '', function ($q) use ($search, $searchDate) {
                    $q->where(function ($w) use ($search, $searchDate) {
                        $w->whereHas('user', function ($qq) use ($search) {
                            $qq->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('user.children', function ($qc) use ($search, $searchDate) {
                            $qc->where('name', 'like', "%{$search}%");
                            if ($searchDate) {
                                $qc->orWhereDate('birth', $searchDate);
                            }
                        });
                    });
                });

            // Se unique=1, retorna apenas o último pedido por usuário (remove nomes duplicados).
            // Mantém o comportamento anterior quando unique não é enviado.
            if ($request->boolean('unique', false)) {
                // Subconsulta: último pedido por chave de unicidade
                $uniqueBy = strtolower((string) $request->query('unique_by', 'user'));
                $sub = $base->cloneWithout(['columns', 'orders']);
                if ($uniqueBy === 'email') {
                    $sub = $sub->join('users', 'users.id', '=', 'orders.users_id')
                        ->selectRaw('MAX(orders.id) as latest_id')
                        ->groupBy('users.email');
                } elseif ($uniqueBy === 'name') {
                    $sub = $sub->join('users', 'users.id', '=', 'orders.users_id')
                        ->selectRaw('MAX(orders.id) as latest_id')
                        ->groupBy('users.name');
                } elseif ($uniqueBy === 'identity') {
                    // Identidade robusta: e-mail normalizado quando houver; caso contrário, fixa por ID do usuário
                    $sub = $sub->join('users', 'users.id', '=', 'orders.users_id')
                        ->selectRaw('MAX(orders.id) as latest_id')
                        ->groupBy(DB::raw("CASE WHEN users.email IS NOT NULL AND users.email <> '' THEN LOWER(users.email) ELSE CONCAT('ID#', users.id) END"));
                } else { // 'user' (padrão)
                    $sub = $sub->selectRaw('MAX(orders.id) as latest_id')
                        ->groupBy('orders.users_id');
                }

                $idsSub = DB::query()->fromSub($sub, 'g')->select('latest_id');

                $grouped = Order::query()
                    ->whereIn('orders.id', $idsSub)
                    ->with(['user:id,name,email', 'product:id,name'])
                    ->select('orders.*')
                    ->selectSub(
                        DB::table('actions_log')->select('action')
                            ->whereColumn('order_id', 'orders.id')
                            ->orderByDesc('created_at')
                            ->limit(1),
                        'last_action'
                    )
                    ->selectSub(
                        DB::table('actions_log')->select('reason')
                            ->whereColumn('order_id', 'orders.id')
                            ->orderByDesc('created_at')
                            ->limit(1),
                        'last_reason'
                    )
                    ->selectSub(
                        DB::table('actions_log')->select('created_at')
                            ->whereColumn('order_id', 'orders.id')
                            ->orderByDesc('created_at')
                            ->limit(1),
                        'last_action_at'
                    )
                    ->orderByDesc('orders.id');
            } else {
                $sub = $base->cloneWithout(['columns', 'orders'])
                    ->selectRaw('orders.users_id, orders.products_id, ' . $dateExpr . ' as day')
                    ->selectRaw('MAX(orders.id) as latest_id')
                    ->groupBy('orders.users_id', 'orders.products_id')
                    ->groupBy(DB::raw($dateExpr));
                $grouped = Order::query()
                    ->joinSub($sub, 'g', 'orders.id', '=', 'g.latest_id')
                    ->with(['user:id,name,email', 'product:id,name'])
                    ->select('orders.*')
                    ->selectSub(
                        DB::table('actions_log')->select('action')
                            ->whereColumn('order_id', 'orders.id')
                            ->orderByDesc('created_at')
                            ->limit(1),
                        'last_action'
                    )
                    ->selectSub(
                        DB::table('actions_log')->select('reason')
                            ->whereColumn('order_id', 'orders.id')
                            ->orderByDesc('created_at')
                            ->limit(1),
                        'last_reason'
                    )
                    ->selectSub(
                        DB::table('actions_log')->select('created_at')
                            ->whereColumn('order_id', 'orders.id')
                            ->orderByDesc('created_at')
                            ->limit(1),
                        'last_action_at'
                    )
                    ->orderByDesc('orders.id');
            }

            $paginator = $grouped->paginate($limit);

            // Garantia extra: se unique=1, elimina quaisquer duplicatas residuais na coleção da página
            if ($request->boolean('unique', false)) {
                $uniqueBy = strtolower((string) $request->query('unique_by', 'user'));
                $collection = $paginator->getCollection();
                if ($uniqueBy === 'email') {
                    $collection = $collection->unique(function ($order) {
                        return strtolower(optional($order->user)->email ?? '') ?: ('ID#' . ($order->users_id ?? ''));
                    });
                } elseif ($uniqueBy === 'name') {
                    $collection = $collection->unique(function ($order) {
                        return optional($order->user)->name ?? ('ID#' . ($order->users_id ?? ''));
                    });
                } elseif ($uniqueBy === 'identity') {
                    $collection = $collection->unique(function ($order) {
                        $email = strtolower(optional($order->user)->email ?? '');
                        return $email !== '' ? $email : ('ID#' . ($order->users_id ?? ''));
                    });
                } else { // user
                    $collection = $collection->unique('users_id');
                }
                $paginator->setCollection($collection->values());
            }
        } else {
            // Para outros filtros, usa consulta normal
            $query = Order::query()
                ->with(['user:id,name,email', 'product:id,name'])
                ->select('orders.*')
                ->selectSub(
                    DB::table('actions_log')->select('action')
                        ->whereColumn('order_id', 'orders.id')
                        ->orderByDesc('created_at')
                        ->limit(1),
                    'last_action'
                )
                ->selectSub(
                    DB::table('actions_log')->select('reason')
                        ->whereColumn('order_id', 'orders.id')
                        ->orderByDesc('created_at')
                        ->limit(1),
                    'last_reason'
                )
                ->selectSub(
                    DB::table('actions_log')->select('created_at')
                        ->whereColumn('order_id', 'orders.id')
                        ->orderByDesc('created_at')
                        ->limit(1),
                    'last_action_at'
                );

            switch ($status) {
                case 'suspensos':
                case 'suspended':
                    $query->whereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') = 'suspenso'");
                    break;
                case 'cancelados':
                case 'canceled':
                    $query->where(function ($q) {
                        $q->where('orders.status', 'canceled')
                            ->orWhereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') = 'cancelado'");
                    });
                    break;
            }

            if ($search !== '') {
                $query->where(function ($w) use ($search, $searchDate) {
                    $w->whereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user.children', function ($qc) use ($search, $searchDate) {
                        $qc->where('name', 'like', "%{$search}%");
                        if ($searchDate) {
                            $qc->orWhereDate('birth', $searchDate);
                        }
                    });
                });
            }

            $paginator = $query->orderByDesc('orders.id')->paginate($limit);
        }

        $payload = SubscriberResource::collection($paginator)->response()->getData(true);

        return response()->json([
            'data' => $payload['data'],
            'current_page' => $payload['meta']['current_page'] ?? $paginator->currentPage(),
            'last_page' => $payload['meta']['last_page'] ?? $paginator->lastPage(),
            'total' => $payload['meta']['total'] ?? $paginator->total(),
        ]);
    }

    /**
     * GET /api/admin/subscribers/counts
     * Retorna os totais globais de cada filtro de assinantes.
     */
    public function getCounts(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $total = Order::query()
            ->where('status', 'active')
            ->whereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') NOT IN ('cancelado','suspenso')")
            ->count();

        $aprovados = Order::query()
            ->where('status', 'active')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $suspensos = Order::query()
            ->whereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') = 'suspenso'")
            ->count();

        $cancelados = Order::query()
            ->where(function ($q) {
                $q->where('status', 'canceled')
                  ->orWhereRaw("COALESCE((SELECT action FROM actions_log WHERE order_id = orders.id ORDER BY created_at DESC LIMIT 1), '') = 'cancelado'");
            })
            ->count();

        $pendentes = User::query()
            ->whereDoesntHave('orders')
            ->count();

        return response()->json([
            'todos' => $total,
            'aprovados' => $aprovados,
            'suspensos' => $suspensos,
            'cancelados' => $cancelados,
            'pendentes' => $pendentes,
        ]);
    }

    /**
     * PUT /api/admin/subscribers/{orderId}/status
     * Atualiza o status de um pedido existente (suspender, cancelar, reativar).
     */
    public function updateStatus(Request $request, $orderId)
    {
        $order = Order::with('user')->find($orderId);
        if (! $order) {
            return response()->json(['message' => 'Pedido não encontrado.'], 404);
        }

        $this->authorize('update', $order);

        $data = Validator::make($request->all(), [
            'status' => ['required', 'string'],
            'action' => ['nullable', 'string'],
            'reason' => ['nullable', 'string', 'max:500'],
        ])->validate();

        $rawStatus = strtolower(trim($data['status']));
        $rawAction = strtolower(trim($data['action'] ?? $rawStatus));

        $actionMap = [
            'suspenso' => 'suspenso',
            'suspender' => 'suspenso',
            'suspended' => 'suspenso',
            'cancelado' => 'cancelado',
            'cancelar' => 'cancelado',
            'canceled' => 'cancelado',
            'reativado' => 'reativado',
            'reativar' => 'reativado',
            'reactivated' => 'reativado',
            'ativo' => 'reativado',
            'active' => 'reativado',
            'aprovado' => 'aprovado',
            'aprovar' => 'aprovado',
            'approved' => 'aprovado',
        ];

        $action = $actionMap[$rawAction] ?? null;
        if (! $action) {
            return response()->json([
                'message' => 'Ação inválida para atualização de status.',
                'allowed' => array_values(array_unique($actionMap)),
            ], 422);
        }

        $reason = $data['reason'] ?? null;
        $executedAt = now();

        DB::transaction(function () use ($order, $action, $reason, $request, $executedAt) {
            if (in_array($action, ['reativado', 'aprovado'], true)) {
                $order->status = Order::STATUS_ACTIVE;
            } elseif ($action === 'cancelado') {
                $order->status = Order::STATUS_CANCELED;
            }
            $order->save();

            ActionLog::create([
                'order_id' => $order->id,
                'product_id' => $order->products_id,
                'user_id' => $order->users_id,
                'action' => $action,
                'quantity' => null,
                'reason' => $reason,
                'action_by' => optional($request->user())->id,
                'created_at' => $executedAt,
            ]);
        });

        // Atualiza atributos derivados para a resposta imediata
        $order->last_action = $action;
        $order->last_reason = $reason;
        $order->last_action_at = $executedAt;

        return response()->json([
            'message' => 'Status atualizado com sucesso.',
            'order_id' => $order->id,
            'status' => $order->status,
            'last_action' => $action,
            'last_reason' => $reason,
        ]);
    }

    /**
     * POST /api/admin/subscribers/{user}/orders
     * Cria uma assinatura (order) para um usuário pendente.
     * Requer products_id no corpo. Opcional amount.
     */
    public function createOrderForUser(Request $request, User $user)
    {
        $this->authorize('create', Order::class);

        $data = Validator::make($request->all(), [
            'products_id' => ['nullable','integer','exists:products,id'],
            'amount' => ['nullable','numeric'],
            'order_id' => ['nullable','integer','min:1'],
        ])->validate();

        $amount = array_key_exists('amount', $data) ? $data['amount'] : null;
        $forcedOrderId = array_key_exists('order_id', $data) ? $data['order_id'] : null;

        $demoRequest = DemoSignupRequest::query()
            ->where('user_id', $user->id)
            ->whereNull('completed_at')
            ->latest('id')
            ->first();

        if ($demoRequest) {
            if (! $forcedOrderId && $demoRequest->suggested_order_id) {
                $forcedOrderId = (int) $demoRequest->suggested_order_id;
            }
            if (! array_key_exists('products_id', $data) && $demoRequest->products_id) {
                $data['products_id'] = (int) $demoRequest->products_id;
            }
            if ($amount === null && $demoRequest->amount !== null) {
                $amount = (float) $demoRequest->amount;
            }
        }

        if ($forcedOrderId) {
            $exists = Order::query()->whereKey($forcedOrderId)->exists();
            if ($exists) {
                Log::warning('Forced order id already exists, fallback to sequential id.', [
                    'forced_order_id' => $forcedOrderId,
                    'user_id' => $user->id,
                ]);
                $forcedOrderId = null;
            }
        }

        $notificationOverride = null;
        if ($demoRequest) {
            $notificationOverride = [
                'type' => 'demo_subscriber_approved',
                'title' => 'DEMO - Assinatura aprovada',
                'body' => sprintf('Solicitação demo de %s foi aprovada no painel.', $user->name),
                'data' => array_filter([
                    'user_id' => $user->id,
                    'origin' => 'demo',
                    'demo_request_id' => $demoRequest->id,
                    'suggested_order_id' => $demoRequest->suggested_order_id,
                    'order_id' => $forcedOrderId,
                ], fn ($value) => $value !== null),
            ];
        }

        try {
            $order = app(OrderProvisioner::class)->provisionOrder(
                $user,
                $data['products_id'] ?? null,
                $amount,
                $forcedOrderId,
                optional($request->user())->id,
                true,
                $notificationOverride
            );
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Falha ao criar assinatura', [
                'user_id' => $user->id,
                'products_id' => $data['products_id'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Erro ao criar assinatura.'
            ], 500);
        }

        if ($demoRequest) {
            $demoRequest->order_id = $order->id;
            $demoRequest->completed_at = now();
            $demoRequest->save();
        }

        return response()->json([
            'message' => 'Assinatura criada com sucesso',
            'order_id' => $order->id,
        ], 201);
    }

    /**
     * Remove um assinante pendente (sem order) do sistema.
     * DELETE /api/admin/subscribers/{user}
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        if ((bool) $user->adm) {
            return response()->json(['message' => 'Não é possível excluir administradores.'], 403);
        }
        // Só permite excluir se o usuário não tiver orders
        if ($user->orders()->exists()) {
            return response()->json(['message' => 'Não é possível excluir: assinante já possui assinatura.'], 422);
        }
        $user->delete();
        return response()->json(['message' => 'Assinante excluído com sucesso.']);
    }
}
