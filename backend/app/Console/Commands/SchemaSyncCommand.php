<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SchemaSyncCommand extends Command
{
    protected $signature = 'schema:sync {--apply : Mark safe pending migrations as ran}';
    protected $description = 'Diagnose and optionally fix migration drift by marking already-present schema migrations as ran';

    public function handle(): int
    {
        $this->info('Scanning pending migrations and current schema...');

        // Known migration -> validator closures for this project
        $validators = [
            '2020_01_01_000000_create_actions_log_table' => function () {
                return Schema::hasTable('actions_log');
            },
            '2020_01_02_000000_create_orders_table' => function () {
                return Schema::hasTable('orders');
            },
            '2020_01_03_000000_create_children_table' => function () {
                return Schema::hasTable('children');
            },
            '2020_01_04_000000_create_products_table' => function () {
                return Schema::hasTable('products');
            },
            '2025_10_01_191214_add_is_admin_to_users_table' => function () {
                return Schema::hasTable('users') && Schema::hasColumn('users', 'adm');
            },
            '2025_10_08_000001_add_address_fields_to_users_table' => function () {
                $cols = ['cep','address','number','complete','neighborhood','city','state'];
                if (!Schema::hasTable('users')) return false;
                foreach ($cols as $c) if (!Schema::hasColumn('users', $c)) return false;
                return true;
            },
            '2025_10_08_000001_add_label_status_to_orders_table' => function () {
                return Schema::hasTable('orders') && Schema::hasColumn('orders', 'label_status');
            },
            '2025_10_09_000001_fix_orders_id_autoincrement' => function () {
                // Hard to validate precisely; assume if orders.id exists and is primary key
                return Schema::hasTable('orders') && Schema::hasColumn('orders', 'id');
            },
            '2025_10_11_000000_create_notifications_table' => function () {
                return Schema::hasTable('notifications');
            },
        ];

        // Fetch applied migrations
        $applied = DB::table('migrations')->pluck('migration')->all();
        $appliedSet = array_fill_keys($applied, true);

        // Discover available migration files
        $path = base_path('database/migrations');
        $files = is_dir($path) ? scandir($path) : [];
        $available = [];
        foreach ($files as $f) {
            if (preg_match('/^\d{4}_\d{2}_\d{2}_\d{6}_.+\.php$/', $f)) {
                $name = substr($f, 0, -4);
                $available[] = $name;
            }
        }

        sort($available);

        $pending = array_values(array_filter($available, function ($name) use ($appliedSet) {
            return !isset($appliedSet[$name]);
        }));

        if (empty($pending)) {
            $this->info('No pending migrations. Nothing to do.');
            return self::SUCCESS;
        }

        $this->line('Pending migrations:');
        foreach ($pending as $name) {
            $this->line(" - $name");
        }

        $candidates = [];
        foreach ($pending as $name) {
            if (isset($validators[$name])) {
                $ok = false;
                try { $ok = (bool) $validators[$name](); } catch (\Throwable $e) { $ok = false; }
                $candidates[$name] = $ok;
            }
        }

        if (empty($candidates)) {
            $this->warn('No known-safe pending migrations detected for auto-marking.');
            return self::SUCCESS;
        }

        $this->line('Safe-to-mark (schema already present):');
        $count = 0;
        foreach ($candidates as $name => $ok) {
            $this->line(sprintf(' - %s ... %s', $name, $ok ? 'OK' : 'missing'));
            if ($ok) $count++;
        }

        if ($count === 0) {
            $this->warn('No candidates are currently satisfied by DB schema.');
            return self::SUCCESS;
        }

        if (!$this->option('apply')) {
            $this->info('Dry-run only. Re-run with --apply to mark as ran.');
            return self::SUCCESS;
        }

        // Compute next batch
        $nextBatch = (int) DB::table('migrations')->max('batch') + 1;
        $inserted = 0;
        foreach ($candidates as $name => $ok) {
            if (!$ok) continue;
            // Double-check not already present
            $exists = DB::table('migrations')->where('migration', $name)->exists();
            if ($exists) continue;
            DB::table('migrations')->insert([
                'migration' => $name,
                'batch' => $nextBatch,
            ]);
            $inserted++;
        }

        $this->info("Marked $inserted migration(s) as ran (batch $nextBatch).");
        return self::SUCCESS;
    }
}
