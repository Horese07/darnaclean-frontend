<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReviewClient;

class ReviewClientController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->query('lang', 'fr');
        $textField = 'text_' . ($lang === 'ar' ? 'ar' : ($lang === 'en' ? 'en' : 'fr'));

        $reviews = ReviewClient::select('id', 'name', 'city', $textField . ' as text', 'rating')
            ->orderByDesc('created_at')
            ->limit(9)
            ->get();

        return response()->json($reviews);
    }
}
