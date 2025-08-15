<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'email',
        'manager_name',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Relations
     */
    public function stocks()
    {
        return $this->hasMany(WarehouseStock::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Methods
     */
    public function getTotalProducts()
    {
        return $this->stocks()->distinct('product_id')->count();
    }

    public function getTotalStock()
    {
        return $this->stocks()->sum('quantity');
    }

    public function getProductStock($productId)
    {
        return $this->stocks()->where('product_id', $productId)->sum('quantity');
    }

    public function setAsDefault()
    {
        // Retirer le défaut des autres entrepôts
        self::where('id', '!=', $this->id)->update(['is_default' => false]);
        
        $this->is_default = true;
        $this->save();
    }
}
