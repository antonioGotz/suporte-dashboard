<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Regra "catch-all": se o usuário for um super-admin, permite todas as ações.
     * ATENÇÃO: Adicione uma coluna 'is_admin' (boolean) à sua tabela 'users'.
     */
    // Libera tudo para admin
        public function before(User $user, $ability)
        {
            if ((bool) $user->adm) {
                return true;
            }
        }

    /**
     * Determina se o usuário pode ver a lista de produtos.
     */
    public function viewAny(User $user): bool
    {
        return true; // Todos os usuários logados podem ver a lista
    }

    /**
     * Determina se o usuário pode ver um produto específico.
     */
    public function view(User $user, Product $product): bool
    {
        return true;
    }

    /**
     * Determina se o usuário pode criar produtos.
     */
    public function create(User $user): bool
    {
        // A regra do 'before' já cuida disso, mas é uma boa prática ser explícito.
        return $user->is_admin;
    }

    /**
     * Determina se o usuário pode atualizar um produto.
     */
    public function update(User $user, Product $product): bool
    {
        return $user->is_admin;
    }

    /**
     * Determina se o usuário pode deletar um produto.
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->is_admin;
    }
}
