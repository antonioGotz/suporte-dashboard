<?php

// FICHEIRO: database/migrations/xxxx_add_expires_at_to_personal_access_tokens_table.php
// OBJETIVO: Adicionar a coluna 'expires_at' que falta na tabela de tokens.

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
        // Este comando diz ao Laravel para modificar a tabela existente.
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            // Adiciona a nova coluna 'expires_at' que pode ser nula,
            // logo após a coluna 'abilities'.
            $table->timestamp('expires_at')->nullable()->after('abilities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Este comando ensina o Laravel a desfazer a alteração se for preciso.
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
};
