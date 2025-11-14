<?php

return [

    'paths' => ['api/*','sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Liste aqui as origens do SPA que irão acessar a API.
    'allowed_origins' => [
        'https://dashboard.suporteatostech.com',
        'https://suporteatostech.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];