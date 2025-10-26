<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beasiswa extends Model
{
    use HasFactory;

    protected $primaryKey = 'nama_beasiswa';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nama_beasiswa',
        'penyelenggara',
        'batasan_tahun',
        'batasan_prodi',
        'tanggal_deadline',
        'biaya_daftar',
        'penerima_uccd',
    ];
}
