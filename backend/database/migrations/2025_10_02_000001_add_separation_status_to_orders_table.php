<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('orders', 'separation_status')) {
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->string('separation_status', 50)
                ->default('Aguardando Separação')
                ->after('status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('separation_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('orders', 'separation_status')) {
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['separation_status']);
            $table->dropColumn('separation_status');
        });
    }
};
