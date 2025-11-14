<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DemoSignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DemoSignupController extends Controller
{
    /**
     * Recebe o cadastro demonstrativo de assinante.
     * POST /api/demo/signup
     */
    public function store(DemoSignupRequest $request)
    {
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'document' => $data['document'] ?? null,
            'phone' => $data['phone'] ?? null,
            'cep' => $data['cep'] ?? null,
            'address' => $data['address'] ?? null,
            'number' => $data['number'] ?? null,
            'complete' => $data['complete'] ?? null,
            'neighborhood' => $data['neighborhood'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'date_birth' => $data['date_birth'] ?? ($data['birth'] ?? null),
        ]);

        return response()->json([
            'message' => 'Assinante criado com sucesso',
            'user_id' => $user->id,
            'order_id' => null,
        ], 201);
    }
}
