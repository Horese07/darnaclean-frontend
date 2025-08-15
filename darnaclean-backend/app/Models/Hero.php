<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $table = 'heros';
    protected $fillable = [
        'title_fr', 'title_ar', 'title_en',
        'description_fr', 'description_ar', 'description_en',
        'cta_fr', 'cta_ar', 'cta_en',
    ];
}
