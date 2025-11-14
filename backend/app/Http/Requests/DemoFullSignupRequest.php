<?php

namespace App\Http\Requests;

class DemoFullSignupRequest extends DemoSignupRequest
{
    public function rules()
    {
        $rules = parent::rules();

        $rules['child_name'] = ['required','string','max:255'];
        $rules['child_birth'] = ['required','date'];
        $rules['order_id'] = ['nullable','integer','min:1'];

        return $rules;
    }
}
