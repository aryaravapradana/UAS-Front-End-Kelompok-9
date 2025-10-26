<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Talk;

class TalkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Talk::create([
            'nama_seminar' => 'Seminar Teknologi AI',
            'penyelenggara' => 'Komunitas Tech',
            'tanggal_pelaksanaan' => '2025-11-15',
            'biaya_daftar' => 0.00,
            'feedback_member' => null,
        ]);
    }
}
