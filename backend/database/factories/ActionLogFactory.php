<?php

namespace Database\Factories;

use App\Models\ActionLog;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActionLogFactory extends Factory
{
    protected $model = ActionLog::class;

    public function definition(): array
    {
        $order = Order::factory()->create();

        return [
            'order_id' => $order->id,
            'product_id' => $order->products_id,
            'user_id' => $order->users_id,
            'action' => 'criado',
            'quantity' => null,
            'reason' => $this->faker->sentence(3),
            'action_by' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

