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
        Schema::table('coach_profiles', function (Blueprint $table) {
            $table->string('payment_option')->default('manual')->after('hourly_rate');
            $table->decimal('payment_rate', 10, 2)->default(0.00)->after('payment_option');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coach_profiles', function (Blueprint $table) {
            $table->dropColumn(['payment_option', 'payment_rate']);
        });
    }
};
