<?php

namespace App\Policies;

use App\Models\User;

class SubscriberPolicy
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
        return (bool) $user->adm;
    }

    public function view(User $user): bool
    {
        return (bool) $user->adm;
    }

    public function create(User $user): bool
    {
        return (bool) $user->adm;
    }

    public function update(User $user): bool
    {
        return (bool) $user->adm;
    }

    public function delete(User $user): bool
    {
        return (bool) $user->adm;
    }
}
