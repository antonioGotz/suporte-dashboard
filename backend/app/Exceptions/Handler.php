<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // default
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        $wantsJson = $request->expectsJson() || str_starts_with($request->path(), 'api/');
        if (!$wantsJson) {
            return parent::render($request, $e);
        }

        if ($e instanceof ValidationException) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }

        if ($e instanceof AuthorizationException) {
            return response()->json([
                'message' => 'This action is unauthorized.'
            ], 403);
        }

        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'message' => 'Recurso não encontrado.'
            ], 404);
        }

        if ($e instanceof ThrottleRequestsException) {
            return response()->json([
                'message' => 'Muitas requisições. Tente novamente mais tarde.'
            ], 429);
        }

        if ($e instanceof HttpExceptionInterface) {
            return response()->json([
                'message' => $e->getMessage() ?: 'Erro na requisição.'
            ], $e->getStatusCode(), $e->getHeaders());
        }

        \Log::error('Unhandled exception', [
            'error' => $e->getMessage(),
            'user_id' => optional($request->user())->id,
            'route' => $request->path(),
            'request_id' => $request->headers->get('X-Request-Id'),
        ]);

        // TEMPORARIO: Mostrar erro completo em modo debug
        if (config('app.debug')) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }

        return response()->json([
            'message' => 'Erro interno do servidor.'
        ], 500);
    }
}

