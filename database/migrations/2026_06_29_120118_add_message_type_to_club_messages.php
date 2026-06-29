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
        Schema::table('club_messages', function (Blueprint $table) {
            // 'regular' → inbox message (long); 'important' → popup alert (short, max 200 chars)
            $table->string('message_type')->default('regular')->after('recipient_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('club_messages', function (Blueprint $table) {
            $table->dropColumn('message_type');
        });
    }
};
