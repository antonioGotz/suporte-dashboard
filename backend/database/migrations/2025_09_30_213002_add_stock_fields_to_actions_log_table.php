<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('actions_log')) {
            return;
        }

        Schema::table('actions_log', function (Blueprint $table) {
            if (! Schema::hasColumn('actions_log', 'product_id')) {
                $table->unsignedBigInteger('product_id')->nullable()->after('order_id');

                if (Schema::hasTable('products')) {
                    $table->foreign('product_id')
                        ->references('id')
                        ->on('products')
                        ->cascadeOnDelete();
                }
            }

            if (! Schema::hasColumn('actions_log', 'quantity')) {
                $table->integer('quantity')->nullable()->after('action');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('actions_log')) {
            return;
        }

        Schema::table('actions_log', function (Blueprint $table) {
            if (Schema::hasColumn('actions_log', 'product_id')) {
                try {
                    $table->dropForeign(['product_id']);
                } catch (\Throwable $exception) {
                    // FK pode não existir no ambiente de teste
                }

                $table->dropColumn('product_id');
            }

            if (Schema::hasColumn('actions_log', 'quantity')) {
                $table->dropColumn('quantity');
            }
        });
    }
};
