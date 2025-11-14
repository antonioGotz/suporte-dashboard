<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // <-- ADICIONE ESTA LINHA
use Illuminate\Foundation\Validation\ValidatesRequests;  // <-- ADICIONE ESTA LINHA
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    // Adicionamos os "traits" que dão ao controller os superpoderes
    // de autorização e validação que precisamos.
    use AuthorizesRequests, ValidatesRequests;
}
