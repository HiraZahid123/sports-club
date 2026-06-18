<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('athlete_profiles', function (Blueprint $table) {
            $table->text('coach_tip')->nullable()->after('poomsae');
        });
    }

    public function down(): void
    {
        Schema::table('athlete_profiles', function (Blueprint $table) {
            $table->dropColumn('coach_tip');
        });
    }
};
