<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Beasiswa;

class BeasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Beasiswa::create([
            'nama_beasiswa' => 'Beasiswa Prestasi Akademik',
            'penyelenggara' => 'Yayasan Pendidikan Jaya',
            'batasan_tahun' => '2022',
            'batasan_prodi' => null,
            'tanggal_deadline' => '2025-11-30',
            'biaya_daftar' => null,
            'penerima_uccd' => null,
        ]);
    }
}
