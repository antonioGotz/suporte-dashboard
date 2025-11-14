<?php

namespace Tests\Feature\Api\Admin;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\ActionLog;
use Illuminate\Support\Carbon;

class SubscriberControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create an admin or authorized user if your policies require it
        $this->user = User::factory()->create(['adm' => 1]);
        $this->actingAs($this->user);
    }

    public function test_show_returns_order_details()
    {
        $owner = User::factory()->create();
        $order = Order::factory()->create([
            'users_id' => $owner->id,
            'status' => 'active',
        ]);

        $res = $this->getJson('/api/admin/subscribers/'.$order->id);
        $res->assertStatus(200)
            ->assertJsonStructure([
                'id','order_id','user_id','user_name','user_email','plan_id','plan_name','subscription_date',
                'order_status','gateway_status','status_code','status_label','last_reason','last_action_at',
                'email','phone','document','address','number','city','state','orders','children'
            ]);
    }

    public function test_show_returns_pending_user_details()
    {
        $pending = User::factory()->create();
        $res = $this->getJson('/api/admin/subscribers/'.$pending->id);
        // Se não houver rota/policy configurada, ajuste conforme necessário
        $res->assertStatus(200)
            ->assertJsonFragment(['status_code' => 'pending']);
    }

    public function test_show_not_found_returns_404()
    {
        $res = $this->getJson('/api/admin/subscribers/999999');
        $res->assertStatus(404)
            ->assertJson(['message' => 'Assinante não encontrado.']);
    }

    public function test_list_returns_paginated_data()
    {
        Order::factory()->count(3)->create();
        $res = $this->getJson('/api/admin/subscribers');
        $res->assertStatus(200)
            ->assertJsonStructure(['data','current_page','last_page','total']);
    }

    public function test_list_only_pending_users()
    {
        // cria 2 usuários sem orders (pendentes) e 1 com order
        $pending1 = User::factory()->create();
        $pending2 = User::factory()->create();
        Order::factory()->create();

        $res = $this->getJson('/api/admin/subscribers?only_pending=true');
        $res->assertStatus(200)
            ->assertJsonStructure(['data','current_page','last_page','total'])
            ->assertJsonFragment(['status_code' => 'pending']);
    }

    public function test_list_filters_status_aprovados_suspensos_cancelados()
    {
        // Aprovados = active nos últimos 30 dias
        Order::factory()->create(['status' => 'active', 'created_at' => now()->subDays(5)]);
        // Cancelados: status canceled
        $canceled = Order::factory()->create(['status' => 'canceled']);
        // Suspensos via actions_log último registro = 'suspenso'
        $suspended = Order::factory()->create(['status' => 'active']);
        ActionLog::factory()->create(['order_id' => $suspended->id, 'product_id' => $suspended->products_id, 'user_id' => $suspended->users_id, 'action' => 'suspenso', 'created_at' => now()]);

        $resA = $this->getJson('/api/admin/subscribers?status=aprovados');
        $resA->assertStatus(200)->assertJsonStructure(['data','current_page','last_page','total']);

        $resC = $this->getJson('/api/admin/subscribers?status=cancelados');
        $resC->assertStatus(200)->assertJsonStructure(['data','current_page','last_page','total']);

        $resS = $this->getJson('/api/admin/subscribers?status=suspensos');
        $resS->assertStatus(200)->assertJsonStructure(['data','current_page','last_page','total']);
    }

    public function test_list_unique_true_paginates_and_returns_data()
    {
        // cria múltiplos orders no mesmo dia para o mesmo (user,product) para testar dedupe
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Order::factory()->create(['users_id' => $user->id, 'products_id' => $product->id, 'created_at' => now()]);
        Order::factory()->create(['users_id' => $user->id, 'products_id' => $product->id, 'created_at' => now()->addMinutes(5)]);
        Order::factory()->create(['users_id' => $user->id, 'products_id' => $product->id, 'created_at' => now()->addDay()]);

        $res = $this->getJson('/api/admin/subscribers?unique=true&limit=10');
        $res->assertStatus(200)
            ->assertJsonStructure(['data','current_page','last_page','total'])
            ->assertJson(fn($json) => $json->where('current_page', 1)->etc());
    }

    public function test_search_by_name_or_email()
    {
        $u = User::factory()->create(['name' => 'Maria Teste', 'email' => 'maria@example.com']);
        Order::factory()->create(['users_id' => $u->id]);

        $resByName = $this->getJson('/api/admin/subscribers?search=Maria');
        $resByName->assertStatus(200)
            ->assertJsonStructure(['data','current_page','last_page','total']);

        $resByEmail = $this->getJson('/api/admin/subscribers?search=example.com');
        $resByEmail->assertStatus(200)
            ->assertJsonStructure(['data','current_page','last_page','total']);
    }

    public function test_create_order_for_user_success()
    {
        $target = User::factory()->create();
        $product = Product::factory()->create();
        $payload = ['products_id' => $product->id, 'amount' => 0];

        $res = $this->postJson('/api/admin/subscribers/'.$target->id.'/orders', $payload);
        $res->assertStatus(201)
            ->assertJsonStructure(['message','order_id']);
    }

    public function test_create_order_for_user_validation_error()
    {
        $target = User::factory()->create();
        $res = $this->postJson('/api/admin/subscribers/'.$target->id.'/orders', []);
        $res->assertStatus(422)
            ->assertJsonStructure(['message','errors']);
    }

    public function test_destroy_user_without_orders()
    {
        $target = User::factory()->create();
        $res = $this->deleteJson('/api/admin/subscribers/'.$target->id);
        $res->assertStatus(200)
            ->assertJson(['message' => 'Assinante excluído com sucesso.']);
    }

    public function test_destroy_user_with_orders_returns_422()
    {
        $target = User::factory()->create();
        Order::factory()->create(['users_id' => $target->id]);
        $res = $this->deleteJson('/api/admin/subscribers/'.$target->id);
        $res->assertStatus(422)
            ->assertJson(['message' => 'Não é possível excluir: assinante já possui assinatura.']);
    }

    public function test_counts_endpoint_returns_expected_keys()
    {
        // Seed alguns casos
        $active = Order::factory()->create(['status' => 'active']);
        $recentActive = Order::factory()->create(['status' => 'active', 'created_at' => now()->subDays(2)]);
        $canceled = Order::factory()->create(['status' => 'canceled']);
        $suspended = Order::factory()->create(['status' => 'active']);
        ActionLog::factory()->create(['order_id' => $suspended->id, 'product_id' => $suspended->products_id, 'user_id' => $suspended->users_id, 'action' => 'suspenso']);

        // pendente: usuário sem order
        User::factory()->create();

        $res = $this->getJson('/api/admin/subscribers/counts');
        $res->assertStatus(200)
            ->assertJsonStructure(['todos','aprovados','suspensos','cancelados','pendentes']);
    }
}
