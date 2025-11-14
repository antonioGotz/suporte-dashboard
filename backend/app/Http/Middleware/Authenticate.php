<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // Se a requisição espera JSON, não tente redirecionar — retorna null
        // para que o framework envie uma resposta 401 JSON adequada.
        if ($request->expectsJson()) {
            return null;
        }

        // Para requisições web normais, retorne a rota de login se ela existir.
        try {
            if (Route::has('login')) {
                return route('login');
            }
        } catch (\Throwable $e) {
            // Se algo falhar ao resolver a rota, retorna null para evitar erro fatal.
            return null;
        }

        return null;
    }
}