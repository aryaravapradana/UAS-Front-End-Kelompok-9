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
        Schema::create('peserta_beasiswa', function (Blueprint $table) {
            $table->string('nim');
            $table->string('nama_beasiswa');
            $table->date('tanggal_daftar');
            $table->enum('status_pembayaran', ['paid', 'unpaid'])->default('unpaid');
            $table->string('status_hasil')->default('pending');
            $table->timestamps();

            $table->primary(['nim', 'nama_beasiswa']);
            $table->foreign('nim')->references('nim')->on('members')->onDelete('cascade');
            $table->foreign('nama_beasiswa')->references('nama_beasiswa')->on('beasiswas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta_beasiswa');
    }
};