<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Member::create([
            'nim' => '123456789',
            'password' => Hash::make('password'),
            'nama_lengkap' => 'John Doe',
            'prodi' => 'Informatika',
            'angkatan' => '2022',
        ]);
    }
}
