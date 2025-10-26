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
        Schema::create('peserta_lomba', function (Blueprint $table) {
            $table->string('nim');
            $table->unsignedBigInteger('id_lomba');
            $table->date('tanggal_daftar');
            $table->enum('status_pembayaran', ['paid', 'unpaid'])->default('unpaid');
            $table->string('status_hasil')->default('pending');
            $table->timestamps();

            $table->primary(['nim', 'id_lomba']);
            $table->foreign('nim')->references('nim')->on('members')->onDelete('cascade');
            $table->foreign('id_lomba')->references('id_lomba')->on('lombas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta_lomba');
    }
};