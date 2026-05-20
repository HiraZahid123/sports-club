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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('club_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_group_id')->nullable()->constrained()->onDelete('set null');
            $table->string('plan_name');
            $table->decimal('amount', 10, 2);
            $table->string('billing_cycle')->default('monthly'); // monthly, yearly
            $table->string('status')->default('active'); // active, overdue, unpaid, canceled
            $table->date('starts_at');
            $table->date('ends_at')->nullable();
            $table->date('last_payment_at')->nullable();
            $table->date('next_payment_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
