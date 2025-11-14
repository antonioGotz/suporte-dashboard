<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('cep', 20)->nullable()->after('adm');
            $table->string('address', 255)->nullable()->after('cep');
            $table->string('number', 20)->nullable()->after('address');
            $table->string('complete', 255)->nullable()->after('number');
            $table->string('neighborhood', 100)->nullable()->after('complete');
            $table->string('city', 100)->nullable()->after('neighborhood');
            $table->string('state', 10)->nullable()->after('city');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['cep', 'address', 'number', 'complete', 'neighborhood', 'city', 'state']);
        });
    }
};
