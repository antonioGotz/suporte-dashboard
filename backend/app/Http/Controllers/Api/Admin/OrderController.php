<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Retorna o maior id atual da tabela orders
    public function maxId()
    {
        $maxId = DB::table('orders')->max('id') ?? 0;
        return response()->json(['maxId' => (int)$maxId]);
    }
}
