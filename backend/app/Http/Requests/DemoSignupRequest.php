<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemoSignupRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Permite acesso público ao endpoint demo
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'document' => 'nullable|string|max:20',
            'phone' => ['required','regex:/^\d{10,11}$/'],
            'cep' => ['required','regex:/^\d{8}$/'],
            'address' => 'required|string|max:255',
            'number' => 'required|string|max:50',
            'complete' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            // aceitar tanto 'date_birth' quanto alias 'birth'
            'date_birth' => 'nullable|date',
            'birth' => 'nullable|date',
            // Plano pode vir do formulário para já criar a assinatura
            'products_id' => 'nullable|integer|exists:products,id',
            'amount' => 'nullable|numeric|min:0',
        ];
    }
}
