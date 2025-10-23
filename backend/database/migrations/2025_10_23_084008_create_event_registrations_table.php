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
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('member_nim');
            $table->foreign('member_nim')->references('nim')->on('members')->onDelete('cascade');
            $table->unsignedBigInteger('event_id');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->timestamp('registration_date')->useCurrent();
            $table->enum('payment_status', ['paid', 'unpaid'])->default('unpaid');
            $table->enum('result_status', ['pending', 'won', 'lost', 'accepted', 'rejected', 'attended'])->default('pending'); // 'attended' for talks
            $table->text('feedback')->nullable(); // For member feedback on talks
            $table->timestamps();

            $table->unique(['member_nim', 'event_id']); // A member can only register for an event once
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};