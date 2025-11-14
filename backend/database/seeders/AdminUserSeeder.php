<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'admin@painel.local';

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrador',
                'password' => 'admin123',
                'adm' => true,
            ]
        );

        if (blank($user->email_verified_at)) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }
    }
}
