<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Member;
use App\Models\Bootcamp;

class PesertaBootcampSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $member = Member::first();
        $bootcamp = Bootcamp::first();

        if ($member && $bootcamp) {
            DB::table('peserta_bootcamp')->insert([
                'nim' => $member->nim,
                'id_bootcamp' => $bootcamp->id_bootcamp,
                'tanggal_daftar' => now(),
                'status_pembayaran' => 'paid',
                'status_hasil' => 'pending',
            ]);
        }
    }
}