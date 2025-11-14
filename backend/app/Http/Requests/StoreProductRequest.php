<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição.
     * Vamos usar a Policy para isso, então aqui pode ser true.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define as regras de validação que se aplicam à requisição.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'image' => 'nullable|string|max:255',
            'video' => 'nullable|string|max:255',
            'signature' => 'sometimes|boolean',
        ];
    }
}
