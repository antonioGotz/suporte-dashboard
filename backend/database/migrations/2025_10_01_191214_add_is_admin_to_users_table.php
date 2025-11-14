<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adiciona a coluna 'is_admin' à tabela 'users'.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Adiciona a nova coluna, com valor padrão 'false' (ou 0).
            // Nenhum usuário existente será afetado no seu login ou funcionamento.
            // A coluna 'adm' que você já tem não será tocada.
            $table->boolean('is_admin')->default(false)->after('password');
        });
    }

    /**
     * Reverse the migrations.
     * Remove a coluna 'is_admin', revertendo a alteração.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
