<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
    /**
     * Lista o histórico de ações com paginação e filtros opcionais.
     * Filtros suportados:
     * - filter: string exata de ação (legacy)
     * - type: semântico (ex.: 'shipped' para envios concluídos)
     * - user_id: restringe ao assinante
     */
    public function index(Request $request)
    {
        $limit = (int) $request->input('limit', 20);
        $limit = max(1, min(100, $limit));
        $filter = (string) $request->input('filter', 'todos');
        $type = (string) $request->input('type', '');
        $userId = $request->input('user_id');

        $query = DB::table('actions_log as log')
            ->leftJoin('users as subscriber', 'log.user_id', '=', 'subscriber.id')
            ->leftJoin('users as admin', 'log.action_by', '=', 'admin.id')
            ->leftJoin('products as p', 'log.product_id', '=', 'p.id')
            ->leftJoin('orders as o', 'log.order_id', '=', 'o.id')
            ->select(
                'log.id',
                'log.order_id',
                'log.product_id',
                'log.user_id',
                'log.action',
                'log.reason',
                'log.created_at',
                'subscriber.name as subscriber_name',
                'subscriber.id as subscriber_id',
                'admin.name as admin_name',
                'p.name as product_name',
                // 'o.tracking_code' removido pois a coluna não existe na tabela orders
            );

        // Filtro legado por ação específica (agora aceita múltiplos valores e variações)
        if ($filter !== 'todos') {
            // Mapeamento dos filtros do frontend para possíveis valores de action no banco
            $filterMap = [
                'criado' => ['criado', 'created'],
                'reativado' => ['reativado', 'reactivated'],
                'suspenso' => ['suspenso', 'suspended'],
                'cancelado' => ['cancelado', 'canceled'],
                'ajuste_estoque' => ['ajuste_estoque', 'stock_adjustment'],
            ];
            $values = $filterMap[$filter] ?? [$filter];
            $query->where(function($q) use ($values) {
                foreach ($values as $val) {
                    $q->orWhere('log.action', 'like', "%$val%");
                }
            });
        }

        // Filtro por usuário (assinante)
        if (!empty($userId)) {
            $query->where('log.user_id', $userId);
        }

        // Filtro semântico
        if ($type === 'shipped') {
            $query->where(function ($q) {
                $q->where('log.action', 'like', '%enviado%')
                  ->orWhere('log.action', 'like', '%coletado%')
                  ->orWhere('log.action', 'like', '%shipped%')
                  ->orWhere('log.action', 'like', 'separation_status_enviado%')
                  ->orWhere('log.action', 'like', 'separation_status_coletado%');
            });
        }

        // Caminho normal: paginação direta + normalização de status
        if ($type !== 'shipped') {
            $logs = $query->orderBy('log.created_at', 'desc')->paginate($limit);
            $logs->getCollection()->transform(function ($row) {
                $action = strtolower((string) ($row->action ?? ''));
                $statusCode = 'other';
                $statusLabel = '—';
                if (str_contains($action, 'criado') || str_contains($action, 'created')) {
                    $statusCode = 'created';
                    $statusLabel = 'Criado';
                } elseif (str_contains($action, 'reativado') || str_contains($action, 'reactivated')) {
                    $statusCode = 'reactivated';
                    $statusLabel = 'Reativado';
                } elseif (str_contains($action, 'suspenso') || str_contains($action, 'suspended')) {
                    $statusCode = 'suspended';
                    $statusLabel = 'Suspenso';
                } elseif (str_contains($action, 'cancelado') || str_contains($action, 'canceled')) {
                    $statusCode = 'canceled';
                    $statusLabel = 'Cancelado';
                }
                // separation_status_*
                if ($statusCode === 'other' && str_starts_with($action, 'separation_status')) {
                    if (str_contains($action, 'enviado') || str_contains($action, 'coletado') || str_contains($action, 'shipped')) {
                        $statusCode = 'shipped';
                        $statusLabel = 'Enviado/Coletado';
                    } elseif (str_contains($action, 'ready') || str_contains($action, 'pendente')) {
                        $statusCode = 'ready';
                        $statusLabel = 'Pendente de Envio';
                    } elseif (str_contains($action, 'progress') || str_contains($action, 'separacao')) {
                        $statusCode = 'in_progress';
                        $statusLabel = 'Em Separação';
                    } elseif (str_contains($action, 'waiting') || str_contains($action, 'aguardando')) {
                        $statusCode = 'waiting';
                        $statusLabel = 'Aguardando Separação';
                    }
                }
                $row->status_code = $statusCode;
                $row->status_label = $statusLabel;
                return $row;
            });
            return response()->json($logs);
        }

        // Caminho especial para shipped: unifica logs + fallback por status atual do pedido
        $page = max(1, (int) $request->input('page', 1));

        $logsRows = $query->orderBy('log.created_at', 'desc')->get();

        // Fallback: pedidos do assinante com status de envio concluído
        $ordersFallback = collect();
        if (!empty($userId)) {
            $ordersFallback = DB::table('orders as fo')
                ->leftJoin('users as fu', 'fo.users_id', '=', 'fu.id')
                ->leftJoin('products as fp', 'fo.products_id', '=', 'fp.id')
                ->where('fo.users_id', $userId)
                ->where(function ($q) {
                    $q->whereRaw('LOWER(fo.separation_status) LIKE ?', ['%enviado%'])
                      ->orWhereRaw('LOWER(fo.separation_status) LIKE ?', ['%coletado%'])
                      ->orWhereRaw('LOWER(fo.separation_status) LIKE ?', ['%shipped%'])
                      ->orWhereRaw('LOWER(fo.separation_status) LIKE ?', ['%conclu%']); // concluído, concluida, etc.
                })
                ->select([
                    DB::raw('fo.id as id'), // id sintético compatível
                    DB::raw('fo.id as order_id'),
                    DB::raw('fo.products_id as product_id'),
                    DB::raw('fo.users_id as user_id'),
                    DB::raw("'separation_status_enviado' as action"),
                    DB::raw('NULL as reason'),
                    DB::raw('fo.updated_at as created_at'),
                    DB::raw('fu.name as subscriber_name'),
                    DB::raw('fu.id as subscriber_id'),
                    DB::raw('NULL as admin_name'),
                    DB::raw('fp.name as product_name'),
                    DB::raw('fo.tracking_code as tracking_code'),
                ])
                ->get();
        }

        $combined = $logsRows->concat($ordersFallback)
            ->unique(function ($row) {
                $oid = is_object($row) ? ($row->order_id ?? $row->id ?? null) : null;
                $ts = is_object($row) ? ($row->created_at ?? '') : '';
                return ($oid ?? 'x') . '|' . (string) $ts;
            })
            // Normaliza status para o front (status_code/label consistentes)
            ->map(function ($row) {
                $action = strtolower((string) ($row->action ?? ''));
                $statusSrc = strtolower((string) ($row->separation_status ?? ''));

                $isShipped = str_contains($action, 'enviado')
                    || str_contains($action, 'coletado')
                    || str_contains($action, 'shipped')
                    || str_contains($statusSrc, 'enviado')
                    || str_contains($statusSrc, 'coletado')
                    || str_contains($statusSrc, 'shipped')
                    || str_contains($statusSrc, 'conclu');

                // Atribui campos adicionais sem remover os existentes
                $row->status_code = $isShipped ? 'shipped' : 'other';
                $row->status_label = $isShipped ? 'Enviado/Coletado' : '—';
                return $row;
            })
            ->sortByDesc(function ($row) {
                return (string) ($row->created_at ?? '');
            })
            ->values();

        $total = $combined->count();
        $slice = $combined->slice(($page - 1) * $limit, $limit)->values();

        $paginator = new \Illuminate\Pagination\LengthAwarePaginator(
            $slice,
            $total,
            $limit,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return response()->json($paginator);
    }

    /**
     * Retorna a contagem de ações para cada tipo de filtro.
     */
    public function getCounts()
    {
        $counts = DB::table('actions_log')
            ->select('action', DB::raw('COUNT(*) as total'))
            ->groupBy('action')
            ->pluck('total', 'action'); // Cria um array [action => total]

        // Adiciona o total de todos os registros
        $counts['todos'] = DB::table('actions_log')->count();

        return response()->json($counts);
    }
}
