<?php
namespace App\Http\Controllers;

use App\Models\Hero;

class HeroController extends Controller
{
    public function show()
    {
        $hero = Hero::first();
        return response()->json($hero);
    }
}
