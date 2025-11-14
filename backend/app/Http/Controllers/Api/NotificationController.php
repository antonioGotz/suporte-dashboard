<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    // GET /api/notifications
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $unread = $request->boolean('unread');
            $limit = (int) $request->query('limit', 20);
            $type = $request->query('type');

            $q = Notification::query()
                ->when($unread, fn($q) => $q->whereNull('read_at'))
                ->when($type, fn($q) => $q->where('type', $type))
                ->where(function ($q) use ($user) {
                    $q->whereNull('user_id')->orWhere('user_id', $user->id);
                })
                ->orderByDesc('id');

            $items = $q->limit($limit)->get();

            return response()->json(['data' => $items]);
        } catch (\Throwable $e) {
            // Fallback resiliente: não quebrar o frontend
            return response()->json(['data' => []]);
        }
    }

    // GET /api/notifications/count
    public function count(Request $request)
    {
        try {
            $user = $request->user();
            $count = Notification::query()
                ->whereNull('read_at')
                ->where(function ($q) use ($user) {
                    $q->whereNull('user_id')->orWhere('user_id', $user->id);
                })
                ->count();

            return response()->json(['unread' => $count]);
        } catch (\Throwable $e) {
            // Fallback: retornar 0 em caso de falha (ex.: tabela não migrada)
            return response()->json(['unread' => 0]);
        }
    }

    // POST /api/notifications/{id}/read
    public function markRead(Request $request, int $id)
    {
        try {
            $user = $request->user();
            $n = Notification::query()
                ->where('id', $id)
                ->where(function ($q) use ($user) {
                    $q->whereNull('user_id')->orWhere('user_id', $user->id);
                })
                ->firstOrFail();

            $n->read_at = now();
            $n->save();

            return response()->json(['ok' => true]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['ok' => false, 'message' => 'Notificação não encontrada'], 404);
        } catch (\Throwable $e) {
            return response()->json(['ok' => false], 200);
        }
    }

    // POST /api/notifications/read-all
    public function markAllRead(Request $request)
    {
        try {
            $user = $request->user();
            Notification::query()
                ->whereNull('read_at')
                ->where(function ($q) use ($user) {
                    $q->whereNull('user_id')->orWhere('user_id', $user->id);
                })
                ->update(['read_at' => now()]);

            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            return response()->json(['ok' => false], 200);
        }
    }
}
