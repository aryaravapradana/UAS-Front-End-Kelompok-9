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
        Schema::create('beasiswas', function (Blueprint $table) {
            $table->string('nama_beasiswa')->primary();
            $table->string('penyelenggara');
            $table->string('batasan_tahun')->nullable();
            $table->string('batasan_prodi')->nullable();
            $table->date('tanggal_deadline');
            $table->decimal('biaya_daftar', 15, 2)->nullable();
            $table->string('penerima_uccd')->nullable();
            $table->foreign('penerima_uccd')->references('nim')->on('members')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beasiswas');
    }
};