<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lomba;

class LombaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Lomba::create([
            'nama_lomba' => 'Lomba Competitive Programming',
            'penyelenggara' => 'Universitas ABC',
            'batasan_tahun' => '2022',
            'batasan_prodi' => 'Informatika',
            'tanggal_deadline' => '2025-12-31',
            'biaya_daftar' => 50000.00,
            'pemenang_uccd' => null,
        ]);
    }
}
