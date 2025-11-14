<?php

return [
    // Horas para considerar como "prazo se aproximando" após entrar em Em Separação
    'separation_due_soon_hours' => env('NOTIFY_SEPARATION_DUE_SOON_HOURS', 24),

    // Horas para considerar como "atrasado"
    'separation_overdue_hours' => env('NOTIFY_SEPARATION_OVERDUE_HOURS', 48),
];

