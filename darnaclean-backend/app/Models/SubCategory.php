<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name_fr',
        'name_ar',
        'name_en',
        'slug',
        'description_fr',
        'description_ar',
        'description_en',
        'image',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relations
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'subcategory_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Mutators & Accessors
     */
    public function getNameAttribute()
    {
        $lang = app()->getLocale();
        return $this->{"name_$lang"} ?? $this->name_fr;
    }

    public function getDescriptionAttribute()
    {
        $lang = app()->getLocale();
        return $this->{"description_$lang"} ?? $this->description_fr;
    }

    public function getProductsCountAttribute()
    {
        return $this->products()->active()->count();
    }

    /**
     * Methods
     */
    public function getLocalizedName($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->{"name_$locale"} ?? $this->name_fr;
    }

    public function getLocalizedDescription($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->{"description_$locale"} ?? $this->description_fr;
    }
}
