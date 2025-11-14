<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\SchemaSyncCommand;
use App\Console\Commands\AddLabelStatusColumn;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        SchemaSyncCommand::class,
        AddLabelStatusColumn::class,
        \App\Console\Commands\PopulateProductImages::class,
    ];
    protected function schedule(Schedule $schedule): void
    {
        // Checagem de prazos de separação (15 em 15 minutos)
        $schedule->command('deadlines:check')->everyFifteenMinutes();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}


