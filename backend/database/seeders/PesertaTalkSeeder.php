<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Member;
use App\Models\Talk;

class PesertaTalkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $member = Member::first();
        $talk = Talk::first();

        if ($member && $talk) {
            DB::table('peserta_talk')->insert([
                'nim' => $member->nim,
                'id_talk' => $talk->id_talk,
                'tanggal_daftar' => now(),
                'status_pembayaran' => 'paid',
                'status_hasil' => 'pending',
            ]);
        }
    }
}