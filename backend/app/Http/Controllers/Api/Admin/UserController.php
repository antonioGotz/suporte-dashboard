<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Busca usuários por nome ou e-mail (uso no Email Composer)
     * GET /api/admin/users/search?q=texto
     */
    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $query = User::query()->select(['id','name','email']);

        // Filtro por nome/email
        $query->where(function ($w) use ($q) {
            $w->where('name', 'like', "%{$q}%")
              ->orWhere('email', 'like', "%{$q}%");
        });

        // Filtro opcional por CPF, caso a coluna exista
        if (Schema::hasColumn('users', 'cpf')) {
            $digits = preg_replace('/[^0-9]/', '', $q);
            if ($digits && strlen($digits) >= 3) {
                // Normaliza CPF no banco removendo pontuação para comparação parcial segura
                $normalizedCpf = "REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), '/', '')";
                $query->orWhere(DB::raw($normalizedCpf), 'like', "%{$digits}%");
            }
        }

        $query->orderBy('name')->limit(15);

        $users = $query->get();

        return response()->json(['data' => $users]);
    }
    /**
     * Atualiza exclusivamente o endereço do usuário (perfil do assinante).
     * Rota: PUT /api/admin/users/{user}/address (auth:sanctum + can:admin)
     */
    public function updateAddress(Request $request, User $user)
    {
        // Como esta rota já está protegida por can:admin no grupo, não exigimos policy específica aqui.
        $data = $request->validate([
            'cep' => ['nullable','string','max:20'],
            'address' => ['nullable','string','max:255'],
            'number' => ['nullable','string','max:20'],
            'neighborhood' => ['nullable','string','max:100'],
            'complete' => ['nullable','string','max:255'],
            'city' => ['nullable','string','max:100'],
            'state' => ['nullable','string','max:2'],
        ]);

        // Atualiza somente os campos de endereço definidos
        $fillableKeys = ['cep','address','number','neighborhood','complete','city','state'];
        $payload = [];
        foreach ($fillableKeys as $k) {
            if ($request->has($k)) {
                $payload[$k] = $data[$k] ?? null;
            }
        }

        if (!empty($payload)) {
            $user->update($payload);
        }

        return response()->json([
            'message' => 'Endereço atualizado com sucesso.',
            'data' => [
                'id' => $user->id,
                'cep' => $user->cep,
                'address' => $user->address,
                'number' => $user->number,
                'neighborhood' => $user->neighborhood,
                'complete' => $user->complete,
                'city' => $user->city,
                'state' => $user->state,
            ],
        ]);
    }
}
