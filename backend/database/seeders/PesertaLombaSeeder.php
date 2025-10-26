<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Member;
use App\Models\Lomba;

class PesertaLombaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $member = Member::first();
        $lomba = Lomba::first();

        if ($member && $lomba) {
            DB::table('peserta_lomba')->insert([
                'nim' => $member->nim,
                'id_lomba' => $lomba->id_lomba,
                'tanggal_daftar' => now(),
                'status_pembayaran' => 'paid',
                'status_hasil' => 'pending',
            ]);
        }
    }
}