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
        Schema::create('peserta_talk', function (Blueprint $table) {
            $table->string('nim');
            $table->unsignedBigInteger('id_talk');
            $table->date('tanggal_daftar');
            $table->enum('status_pembayaran', ['paid', 'unpaid'])->default('unpaid');
            $table->string('status_hasil')->default('pending');
            $table->timestamps();

            $table->primary(['nim', 'id_talk']);
            $table->foreign('nim')->references('nim')->on('members')->onDelete('cascade');
            $table->foreign('id_talk')->references('id_talk')->on('talks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta_talk');
    }
};