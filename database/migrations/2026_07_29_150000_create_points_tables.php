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
        // 1. Event Categories
        Schema::create('event_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('points')->default(0);
            $table->timestamps();
        });

        // 2. Athlete Point Histories
        Schema::create('athlete_point_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('athlete_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('club_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('points');
            $table->date('period_start_date');
            $table->date('period_end_date');
            $table->timestamps();
        });

        // 3. Update Events Table
        Schema::table('events', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('pdf_path');
            $table->foreignId('event_category_id')->nullable()->after('club_id')->constrained('event_categories')->nullOnDelete();
        });

        // 4. Update Event Groups Table
        Schema::table('event_groups', function (Blueprint $table) {
            $table->boolean('can_join')->default(true)->after('training_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_groups', function (Blueprint $table) {
            $table->dropColumn('can_join');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['event_category_id']);
            $table->dropColumn(['image_path', 'event_category_id']);
        });

        Schema::dropIfExists('athlete_point_histories');
        Schema::dropIfExists('event_categories');
    }
};
