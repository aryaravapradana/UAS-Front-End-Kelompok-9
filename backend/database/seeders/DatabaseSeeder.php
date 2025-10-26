<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MemberSeeder::class,
            LombaSeeder::class,
            BeasiswaSeeder::class,
            TalkSeeder::class,
            BootcampSeeder::class,
            PesertaLombaSeeder::class,
            PesertaBeasiswaSeeder::class,
            PesertaTalkSeeder::class,
            PesertaBootcampSeeder::class,
        ]);
    }
}