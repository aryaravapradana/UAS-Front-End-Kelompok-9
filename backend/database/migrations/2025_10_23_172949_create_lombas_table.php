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
        Schema::create('lombas', function (Blueprint $table) {
            $table->bigIncrements('id_lomba');
            $table->string('nama_lomba');
            $table->string('penyelenggara');
            $table->string('batasan_tahun')->nullable();
            $table->string('batasan_prodi')->nullable();
            $table->date('tanggal_deadline');
            $table->decimal('biaya_daftar', 15, 2)->nullable();
            $table->string('pemenang_uccd')->nullable();
            $table->foreign('pemenang_uccd')->references('nim')->on('members')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lombas');
    }
};