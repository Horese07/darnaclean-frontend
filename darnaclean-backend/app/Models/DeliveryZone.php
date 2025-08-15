<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'cities',
        'postal_codes',
        'shipping_cost',
        'free_shipping_threshold',
        'delivery_time_min',
        'delivery_time_max',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'cities' => 'array',
        'postal_codes' => 'array',
        'shipping_cost' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Relations
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
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
     * Methods
     */
    public function coverCity($city)
    {
        return in_array(strtolower($city), array_map('strtolower', $this->cities ?? []));
    }

    public function coverPostalCode($postalCode)
    {
        return in_array($postalCode, $this->postal_codes ?? []);
    }

    public function getShippingCost($orderTotal = 0)
    {
        if ($this->free_shipping_threshold && $orderTotal >= $this->free_shipping_threshold) {
            return 0;
        }
        
        return $this->shipping_cost;
    }

    public function getDeliveryTimeText()
    {
        if ($this->delivery_time_min === $this->delivery_time_max) {
            return $this->delivery_time_min . ' jour' . ($this->delivery_time_min > 1 ? 's' : '');
        }
        
        return $this->delivery_time_min . '-' . $this->delivery_time_max . ' jours';
    }

    public static function findByCity($city)
    {
        return self::active()
            ->get()
            ->first(function ($zone) use ($city) {
                return $zone->coverCity($city);
            });
    }

    public static function findByPostalCode($postalCode)
    {
        return self::active()
            ->get()
            ->first(function ($zone) use ($postalCode) {
                return $zone->coverPostalCode($postalCode);
            });
    }
}
