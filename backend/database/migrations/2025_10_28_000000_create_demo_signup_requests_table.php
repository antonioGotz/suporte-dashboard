<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('demo_signup_requests')) {
            return;
        }

        Schema::create('demo_signup_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('suggested_order_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('products_id')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('origin')->default('demo');
            $table->json('payload')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('completed_at');
            $table->index('origin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_signup_requests');
    }
};
