<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request; // <-- Importante para o tratamento de exceções
use App\Http\Middleware\VerifyCsrfToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // Garante que suas rotas de API sejam carregadas
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Configurar para NÃO redirecionar em requisições API (retorna 401 JSON)
        $middleware->redirectGuestsTo(function ($request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                abort(401, 'Unauthenticated.');
            }
            return null;
        });

        // Aliases úteis
        $middleware->alias([
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
        ]);

        // Ordem para API stateful (SPA em localhost:5173):
        // 1) Cookies + Session (antes de auth:sanctum)
        // 2) EnsureFrontendRequestsAreStateful (marca a request como stateful)
        // Isso garante que a autenticação por cookie funcione e que logout invalide a sessão.
        $middleware->prependToGroup('api', [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->appendToGroup('api', VerifyCsrfToken::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // --- TRATAMENTO DE ERROS PARA A API ---
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                // Em modo debug, mostrar erro completo
                if (config('app.debug')) {
                    return response()->json([
                        'message' => $e->getMessage(),
                        'exception' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => collect($e->getTrace())->take(5)->toArray()
                    ], 500);
                }
                
                // Em produção, mensagem genérica
                return response()->json([
                    'message' => 'Ocorreu um erro interno no servidor.',
                ], 500);
            }
        });
    })->create();
