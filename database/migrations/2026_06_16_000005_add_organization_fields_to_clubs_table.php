<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->string('sport_type')->nullable();
            $table->date('founding_date')->nullable();
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn(['sport_type', 'founding_date', 'opening_time', 'closing_time']);
        });
    }
};
