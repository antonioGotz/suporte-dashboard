<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Child;

class DebugController extends Controller
{
    // Retorna todos os usuários, pedidos e filhos para depuração admin
    public function all()
    {
        return response()->json([
            'users' => User::all(),
            'orders' => Order::all(),
            'children' => Child::all(),
        ]);
    }
}
