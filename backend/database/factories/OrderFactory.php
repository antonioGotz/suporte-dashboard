<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        return [
            'id' => null, // deixa o DB atribuir, mesmo que em produção haja lógica manual
            'users_id' => $user->id,
            'products_id' => $product->id,
            'status' => Order::STATUS_ACTIVE,
            'separation_status' => Order::SEPARATION_STATUS_PENDING,
            'amount' => $this->faker->randomFloat(2, 0, 999),
        ];
    }
}

