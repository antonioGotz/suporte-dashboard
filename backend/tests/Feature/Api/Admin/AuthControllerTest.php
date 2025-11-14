<?php

namespace Tests\Feature\Api\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_returns_token_and_user_payload(): void
    {
        $password = 'SenhaForte123!';
        $user = User::factory()->create([
            'adm' => 1,
            'password' => Hash::make($password),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'token',
                'data' => ['id', 'name', 'email', 'adm'],
            ]);

        $token = $response->json('token');

        $this->assertIsString($token);
        $this->assertTrue(Str::contains($token, '|')); // Formato padrão Sanctum: id|token
    }

    public function test_login_rejects_non_admin_users(): void
    {
        $password = 'SenhaForte123!';
        $user = User::factory()->create([
            'adm' => 0,
            'password' => Hash::make($password),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Acesso restrito a administradores.']);
    }

    public function test_logout_revokes_current_token(): void
    {
        $password = 'SenhaForte123!';
        $user = User::factory()->create([
            'adm' => 1,
            'password' => Hash::make($password),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ])->assertOk();

        $token = $loginResponse->json('token');

        $this->getJson('/api/user', [
            'Authorization' => 'Bearer '.$token,
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->assertOk();

        $this->postJson('/api/admin/logout', [], [
            'Authorization' => 'Bearer '.$token,
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->assertOk();

        $this->getJson('/api/user', [
            'Authorization' => 'Bearer '.$token,
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->assertUnauthorized();
    }
}
