<?php

// FICHEIRO: app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\TransientToken;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Body: { email, password }
     * Resposta esperada pelo seu LoginPage.jsx: { token, data: user }
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        /** @var User|null $user */
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], (string) $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        if (isset($user->adm) && !$user->adm) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        // Zera tokens antigos para esta aplicação antes de emitir um novo token de sessão.
        try {
            $user->tokens()->where('name', 'admin-dashboard')->delete();
        } catch (\Throwable $e) {
            // Caso a limpeza falhe, seguimos adiante para não travar o login.
        }

        $token = $user->createToken('admin-dashboard', ['*'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'adm' => (bool) $user->adm,
            ],
        ]);
    }

    /**
     * POST /api/admin/logout (auth:sanctum)
     * Invalida todos os tokens do usuário atual.
     */
    public function logout(Request $request)
    {
        // Fazer logout do usuário (guard web)
        Auth::guard('web')->logout();

        // Invalidar sessão atual
        $request->session()->invalidate();

        // Regenerar token CSRF
        $request->session()->regenerateToken();

        // 🔥 LIMPAR TODOS OS COOKIES DO DOMÍNIO
        $cookies = [
            'laravel_session',
            'XSRF-TOKEN',
            config('session.cookie'),
        ];

        foreach ($cookies as $cookie) {
            Cookie::queue(Cookie::forget($cookie));
        }

        // Limpar cookies adicionais que possam existir
        foreach ($request->cookies->all() as $name => $value) {
            if (str_starts_with($name, 'laravel_') || str_starts_with($name, 'XSRF-')) {
                Cookie::queue(Cookie::forget($name));
            }
        }

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ])->withoutCookie('laravel_session')
            ->withoutCookie('XSRF-TOKEN');
    }
}
