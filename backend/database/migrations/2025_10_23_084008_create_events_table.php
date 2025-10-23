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
        Schema::create('events', function (Blueprint $table) {
            $table->id(); // Auto-incrementing Primary Key
            $table->string('name');
            $table->enum('type', ['lomba', 'beasiswa', 'talk', 'bootcamp']);
            $table->string('organizer');
            $table->date('deadline')->nullable(); // Optional
            $table->date('event_date')->nullable(); // For talks/seminars
            $table->decimal('registration_fee', 8, 2)->default(0); // Optional, can be 0 for free events
            $table->string('year_limitations')->nullable(); // e.g., "22,23,24"
            $table->string('major_limitations')->nullable(); // e.g., "535,825"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};