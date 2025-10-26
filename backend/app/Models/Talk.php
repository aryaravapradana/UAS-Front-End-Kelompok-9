<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Talk extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_talk';

    protected $fillable = [
        'nama_seminar',
        'penyelenggara',
        'tanggal_pelaksanaan',
        'biaya_daftar',
        'feedback_member',
    ];
}
