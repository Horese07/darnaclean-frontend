<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'total',
        'product_snapshot',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'product_snapshot' => 'array',
    ];

    /**
     * Relations
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Mutators & Accessors
     */
    public function getTotalAttribute($value)
    {
        return $value ?? ($this->quantity * $this->price);
    }

    /**
     * Methods
     */
    public function calculateTotal()
    {
        $this->total = $this->quantity * $this->price;
        $this->save();
    }

    public function getProductName($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        
        if ($this->product_snapshot && isset($this->product_snapshot["name_$locale"])) {
            return $this->product_snapshot["name_$locale"];
        }
        
        if ($this->product) {
            return $this->product->getLocalizedName($locale);
        }
        
        return 'Produit supprimé';
    }

    public function getProductImage()
    {
        if ($this->product_snapshot && isset($this->product_snapshot['image'])) {
            return $this->product_snapshot['image'];
        }
        
        if ($this->product && $this->product->main_image) {
            return $this->product->main_image;
        }
        
        return null;
    }
}
