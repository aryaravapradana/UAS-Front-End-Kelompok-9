<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Member;
use App\Models\Beasiswa;

class PesertaBeasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $member = Member::first();
        $beasiswa = Beasiswa::first();

        if ($member && $beasiswa) {
            DB::table('peserta_beasiswa')->insert([
                'nim' => $member->nim,
                'nama_beasiswa' => $beasiswa->nama_beasiswa,
                'tanggal_daftar' => now(),
                'status_pembayaran' => 'paid',
                'status_hasil' => 'pending',
            ]);
        }
    }
}