<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bootcamp extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_bootcamp';

    protected $fillable = [
        'nama_bootcamp',
        'penyelenggara',
        'tanggal_deadline',
        'biaya_daftar',
    ];
}
