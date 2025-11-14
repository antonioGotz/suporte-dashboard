<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class SeparationPolicy
{
    // Libera tudo para admin
        public function before(User $user, $ability)
        {
            if ((bool) $user->adm) {
                return true;
            }
        }

    public function viewAny(User $user): bool
    {
        // Permite apenas admins (fallback caso o before não seja aplicado)
        return (bool) $user->adm;
    }
    public function view(User $user, Order $order): bool
    {
        return (bool) $user->adm;
    }
    public function create(User $user): bool
    {
        return (bool) $user->adm;
    }
    public function update(User $user, Order $order): bool
    {
        // Atualização de status de separação: restrita a admins
        return (bool) $user->adm;
    }
    public function delete(User $user, Order $order): bool
    {
        return (bool) $user->adm;
    }
}
