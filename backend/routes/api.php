<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Lomba;
use App\Models\Beasiswa;
use App\Models\Bootcamp;
use App\Models\Talk;
use App\Models\Member;

Route::get('/test', function () {
    return response()->json(['message' => 'Connection successful! Data from Laravel Backend.']);
});

Route::get('/lomba', function () {
    return Lomba::all();
});

Route::get('/beasiswa', function () {
    return Beasiswa::all();
});

Route::get('/bootcamp', function () {
    return Bootcamp::all();
});

Route::get('/talk', function () {
    return Talk::all();
});

Route::get('/member', function () {
    return Member::all();
});
