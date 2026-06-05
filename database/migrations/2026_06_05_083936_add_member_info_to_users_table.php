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
        Schema::table('users', function (Blueprint $table) {
            $table->string('id_code')->nullable()->after('email');
            $table->string('phone')->nullable()->after('id_code');
            $table->string('city')->nullable()->after('phone');
            $table->string('emergency_contact_name')->nullable()->after('city');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['id_code', 'phone', 'city', 'emergency_contact_name', 'emergency_contact_phone']);
        });
    }
};
