<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DemoFullSignupRequest;
use App\Models\Child;
use App\Models\DemoSignupRequest;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use RuntimeException;

class DemoFullSignupController extends Controller
{
    public function store(DemoFullSignupRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = DB::transaction(function () use ($data) {
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

                $nextChildId = (int) ((DB::table('children')->max('id')) ?? 0) + 1;
                $child = Child::create([
                    'id' => $nextChildId,
                    'users_id' => $user->id,
                    'name' => $data['child_name'],
                    'birth' => $data['child_birth'],
                ]);

                $payload = Arr::except($data, ['password']);
                $demoRequest = DemoSignupRequest::create([
                    'user_id' => $user->id,
                    'suggested_order_id' => $data['order_id'] ?? null,
                    'products_id' => $data['products_id'] ?? null,
                    'amount' => array_key_exists('amount', $data) ? $data['amount'] : null,
                    'origin' => 'demo',
                    'payload' => $payload,
                ]);

                Notification::create([
                    'user_id' => null,
                    'type' => 'demo_subscriber_pending',
                    'title' => 'DEMO - Validação necessária',
                    'body' => sprintf('Cadastro demo de %s precisa ser aprovado para gerar assinatura.', $user->name),
                    'data' => [
                        'user_id' => $user->id,
                        'demo_request_id' => $demoRequest->id,
                        'origin' => 'demo',
                        'suggested_order_id' => $demoRequest->suggested_order_id,
                        'products_id' => $demoRequest->products_id,
                    ],
                ]);

                return compact('user', 'child', 'demoRequest');
            });
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Falha ao processar cadastro demo completo', [
                'email' => $data['email'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Não foi possível concluir o cadastro demo.',
            ], 500);
        }

        return response()->json([
            'message' => 'Cadastro demo criado e enviado para validação.',
            'user_id' => $result['user']->id,
            'child_id' => $result['child']->id,
            'demo_request_id' => $result['demoRequest']->id,
            'order_id' => null,
            'pending' => true,
            'suggested_order_id' => $result['demoRequest']->suggested_order_id,
        ], 201);
    }
}
