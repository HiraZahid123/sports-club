<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('club_invitations', function (Blueprint $table) {
            $table->string('payment_option')->default('manual')->after('role');
            $table->decimal('payment_rate', 10, 2)->default(0)->after('payment_option');
        });
    }

    public function down(): void
    {
        Schema::table('club_invitations', function (Blueprint $table) {
            $table->dropColumn(['payment_option', 'payment_rate']);
        });
    }
};
