<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SeparationHistoryController extends Controller
{
    public function index($userId)
    {
        $query = DB::table('actions_log')
            ->select(
                'actions_log.id',
                'actions_log.order_id',
                'actions_log.product_id',
                'actions_log.action',
                'actions_log.created_at',
                'products.name as product_name'
            )
            ->leftJoin('products', 'actions_log.product_id', '=', 'products.id')
            ->where('actions_log.user_id', $userId)
            ->where('actions_log.action', 'like', 'separation_status_%')
            ->orderBy('actions_log.created_at', 'desc');

    Log::info('[SeparationHistory] Query:', [
            'userId' => $userId,
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings(),
        ]);

        $history = $query->get();
    Log::info('[SeparationHistory] Result:', [
            'count' => $history->count(),
            'data' => $history,
        ]);

        return response()->json($history);
    }
}
