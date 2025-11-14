<?php
namespace App\Models\Scopes;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $user = Auth::user();
        // Se não há usuário autenticado, não aplica filtro (ex: comandos artisan)
        if (!$user) {
            return;
        }
        // Se for admin, nunca aplica filtro
        if ((bool) $user->adm) {
            return;
        }
        // Detecta a coluna correta de relacionamento
        $table = $model->getTable();
        $userColumn = null;
        if (Schema::hasColumn($table, 'users_id')) {
            $userColumn = 'users_id';
        } elseif (Schema::hasColumn($table, 'user_id')) {
            $userColumn = 'user_id';
        }
        if ($userColumn) {
            $builder->where($table . '.' . $userColumn, $user->id);
        }
    }
}
