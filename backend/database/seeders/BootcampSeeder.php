<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bootcamp;

class BootcampSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bootcamp::create([
            'nama_bootcamp' => 'Bootcamp Web Development',
            'penyelenggara' => 'Coding Academy',
            'tanggal_deadline' => '2025-11-20',
            'biaya_daftar' => 500000.00,
        ]);
    }
}
