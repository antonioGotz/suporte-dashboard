<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class AddLabelStatusColumn extends Command
{
    protected $signature = 'orders:add-label-status';
    protected $description = 'Safely add label_status column to orders if missing';

    public function handle(): int
    {
        if (!Schema::hasTable('orders')) {
            $this->error('Table orders does not exist. Aborting.');
            return self::FAILURE;
        }

        if (Schema::hasColumn('orders', 'label_status')) {
            $this->info('orders.label_status already exists. Nothing to do.');
            return self::SUCCESS;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->string('label_status', 50)->nullable()->after('id');
        });

        $this->info('orders.label_status column added successfully.');
        return self::SUCCESS;
    }
}

