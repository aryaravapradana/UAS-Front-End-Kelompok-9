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
        Schema::create('talks', function (Blueprint $table) {
            $table->bigIncrements('id_talk');
            $table->string('nama_seminar');
            $table->string('penyelenggara');
            $table->date('tanggal_pelaksanaan');
            $table->decimal('biaya_daftar', 15, 2)->nullable();
            $table->text('feedback_member')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('talks');
    }
};