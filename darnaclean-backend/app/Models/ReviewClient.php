<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewClient extends Model
{
    use HasFactory;

    protected $table = 'reviews_Client';
    protected $fillable = [
        'name', 'city', 'text_fr', 'text_en', 'text_ar', 'rating'
    ];
}
