<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

// Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\SubscriberController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\SeparationController;
use App\Http\Controllers\Api\Admin\HistoryController;
use App\Http\Controllers\Api\Admin\SeparationAlertController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\DebugController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\UploadController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DemoFullSignupController;
use App\Http\Controllers\Api\DemoSignupController;


// Healthcheck fora do prefixo admin
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'ok';
    } catch (\Exception $e) {
        $dbStatus = 'down';
    }
    return response()->json(['app' => 'ok', 'db' => $dbStatus]);
});

// Autenticação (login)
Route::post('/login', [AuthController::class, 'login']);

// ROTA DE TESTE - COMENTADA POR SEGURANÇA (expõe stack trace)
// NÃO DESCOMENTAR EM PRODUÇÃO sem adicionar verificação de ambiente
/*
Route::post('/test-login', function (Request $request) {
    try {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        
        $user = App\Models\User::where('email', $credentials['email'])->first();
        
        if (!$user) {
            return response()->json(['error' => 'Usuario nao encontrado'], 404);
        }
        
        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Senha incorreta'], 401);
        }
        
        if (isset($user->adm) && !$user->adm) {
            return response()->json(['error' => 'Nao eh admin'], 403);
        }
        
        $token = $user->createToken('admin-dashboard')->plainTextToken;
        
        return response()->json([
            'token' => $token,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'adm' => (bool) $user->adm,
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
*/

// Retornar usuário autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json(['data' => $request->user()]);
});

// Cadastro demonstrativo de assinante (público)
Route::post('/demo/signup', [DemoSignupController::class, 'store']);
Route::post('/demo/signup/full', [DemoFullSignupController::class, 'store']);

// --- Grupo Administrativo ---
// Protegido por Sanctum, Throttling e o Gate "admin"
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'throttle:api', 'can:admin'])
    ->group(function () {

    // Debug
    Route::get('/debug/all', [DebugController::class, 'all']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    // Assinantes
    Route::get('/subscribers', [SubscriberController::class, 'listSubscribers']);
    Route::get('/subscribers/counts', [SubscriberController::class, 'getCounts']);
    Route::get('/subscribers/search', [SubscriberController::class, 'searchLite']);
        Route::post('/subscribers', [SubscriberController::class, 'createSubscriber']);
        Route::put('/subscribers/{orderId}/status', [SubscriberController::class, 'updateStatus'])
            ->whereNumber('orderId');
    // Aprovar solicitação
    Route::post('/subscribers/{user}/orders', [SubscriberController::class, 'createOrderForUser'])
            ->whereNumber('user');
        Route::get('/subscribers/{id}', [SubscriberController::class, 'show'])
            ->whereNumber('id');
    // Excluir assinante pendente
    Route::delete('/subscribers/{user}', [SubscriberController::class, 'destroy'])->whereNumber('user');

        // Separações
        Route::get('/separation', [SeparationController::class, 'index']);
        Route::get('/separation/{order}', [SeparationController::class, 'show'])
            ->whereNumber('order');
        Route::match(['put', 'patch'], '/separation/{order}', [SeparationController::class, 'updateStatus'])
            ->whereNumber('order');
        Route::post('/orders/{order}/shipping/label', [SeparationController::class, 'generateLabel'])
            ->whereNumber('order');
        Route::get('/shipping/labels/recent', [SeparationController::class, 'labelHistory']);

    // Orders (Max ID)
    Route::get('/orders/max-id', [OrderController::class, 'maxId']);

    // Upload
    Route::post('/upload', [UploadController::class, 'store']);

    // Produtos
    // Rota para planos precisa vir antes do resource
    Route::get('/products/plans', [ProductController::class, 'listSubscriptionPlans']);
        Route::apiResource('products', ProductController::class)->except(['create', 'edit']);

    // Histórico
    Route::get('/history', [HistoryController::class, 'index']);
        Route::get('/history/counts', [HistoryController::class, 'getCounts']);

    // Alertas (Se o controller existir)
    // Route::get('/separation/alerts', [SeparationAlertController::class, 'index']);

    // Notificações (admin)
    Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/count', [NotificationController::class, 'count']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])->whereNumber('id');
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Usuários (Admin)
    Route::get('/users/search', [UserController::class, 'search']);
        Route::put('/users/{user}/address', [UserController::class, 'updateAddress'])->whereNumber('user');
    });