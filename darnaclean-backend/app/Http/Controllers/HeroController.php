<?php
namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function show(Request $request)
    {
        $lang = $request->query('lang', 'fr');
        $hero = Hero::first();
        if (!$hero) {
            return response()->json(['error' => 'No hero found'], 404);
        }
        return response()->json([
            'title' => $hero['title_' . $lang] ?? $hero['title_fr'],
            'description' => $hero['description_' . $lang] ?? $hero['description_fr'],
            'cta' => $hero['cta_' . $lang] ?? $hero['cta_fr'],
        ]);
    }
}
