<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriberStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // a Policy é verificada no Controller
    }

    public function rules(): array
    {
        return [
            // Aceita 'action' (preferido) OU 'status' (compat extra com seu front atual)
            'action' => 'nullable|in:suspenso,cancelado,reativado',
            'status' => 'nullable|in:suspenso,cancelado,reativado',
            'reason' => 'nullable|string|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'action.in' => 'Ação inválida. Use: suspenso, cancelado ou reativado.',
            'status.in' => 'Status inválido. Use: suspenso, cancelado ou reativado.',
        ];
    }
}
