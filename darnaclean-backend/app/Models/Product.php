<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name_fr',
        'name_ar', 
        'name_en',
        'slug',
        'description_fr',
        'description_ar',
        'description_en',
        'price',
        'original_price',
        'currency',
        'category_id',
        'subcategory_id',
        'brand',
        'sku',
        'stock',
        'images',
        'featured',
        'on_sale',
        'badges',
        'specifications',
        'rating',
        'review_count',
        'tags',
        'meta_title',
        'meta_description',
        'is_active',
        'weight',
        'dimensions',
    ];

    protected $casts = [
        'images' => 'array',
        'badges' => 'array',
        'specifications' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'on_sale' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'dimensions' => 'array',
    ];

    /**
     * Relations
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(User::class, 'user_favorites');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function warehouseStocks()
    {
        return $this->hasMany(WarehouseStock::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOnSale($query)
    {
        return $query->where('on_sale', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeBySubcategory($query, $subcategoryId)
    {
        return $query->where('subcategory_id', $subcategoryId);
    }

    public function scopeByBrand($query, $brand)
    {
        return $query->where('brand', $brand);
    }

    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name_fr', 'like', "%{$term}%")
              ->orWhere('name_ar', 'like', "%{$term}%")
              ->orWhere('name_en', 'like', "%{$term}%")
              ->orWhere('description_fr', 'like', "%{$term}%")
              ->orWhere('description_ar', 'like', "%{$term}%")
              ->orWhere('description_en', 'like', "%{$term}%")
              ->orWhere('sku', 'like', "%{$term}%")
              ->orWhere('brand', 'like', "%{$term}%");
        });
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

    public function getDiscountPercentageAttribute()
    {
        if ($this->original_price && $this->original_price > $this->price) {
            return round((($this->original_price - $this->price) / $this->original_price) * 100);
        }
        return 0;
    }

    public function getIsInStockAttribute()
    {
        return $this->stock > 0;
    }

    public function getMainImageAttribute()
    {
        return $this->images[0] ?? null;
    }

    public function getTotalStockAttribute()
    {
        return $this->warehouseStocks->sum('quantity');
    }

    /**
     * Methods
     */
    public function decreaseStock($quantity)
    {
        if ($this->stock >= $quantity) {
            $this->stock -= $quantity;
            $this->save();
            return true;
        }
        return false;
    }

    public function increaseStock($quantity)
    {
        $this->stock += $quantity;
        $this->save();
    }

    public function updateRating()
    {
        $reviews = $this->reviews;
        if ($reviews->count() > 0) {
            $this->rating = $reviews->avg('rating');
            $this->review_count = $reviews->count();
            $this->save();
        }
    }

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
