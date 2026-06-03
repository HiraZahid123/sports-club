<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_group_id')->constrained()->onDelete('cascade');
            $table->string('day_of_week');   // Monday, Tuesday …
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_schedules');
    }
};
