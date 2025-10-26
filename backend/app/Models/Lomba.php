<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lomba extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_lomba';

    protected $fillable = [
        'nama_lomba',
        'penyelenggara',
        'batasan_tahun',
        'batasan_prodi',
        'tanggal_deadline',
        'biaya_daftar',
        'pemenang_uccd',
    ];
}
