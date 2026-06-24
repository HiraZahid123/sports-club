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
        Schema::table('events', function (Blueprint $table) {
            $table->string('coach_salary_type')->nullable()->after('points'); // per_athlete | fixed | per_hour | free
            $table->decimal('coach_salary_rate', 10, 2)->nullable()->after('coach_salary_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['coach_salary_type', 'coach_salary_rate']);
        });
    }
};
