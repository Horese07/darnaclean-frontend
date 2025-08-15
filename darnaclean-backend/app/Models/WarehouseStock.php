<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'quantity',
        'reserved_quantity',
        'minimum_stock',
        'maximum_stock',
        'location',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'reserved_quantity' => 'integer',
        'minimum_stock' => 'integer',
        'maximum_stock' => 'integer',
    ];

    /**
     * Relations
     */
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scopes
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('quantity', '<=', 'minimum_stock');
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '<=', 0);
    }

    /**
     * Mutators & Accessors
     */
    public function getAvailableQuantityAttribute()
    {
        return $this->quantity - $this->reserved_quantity;
    }

    public function getIsLowStockAttribute()
    {
        return $this->quantity <= $this->minimum_stock;
    }

    public function getIsOutOfStockAttribute()
    {
        return $this->quantity <= 0;
    }

    /**
     * Methods
     */
    public function addStock($quantity, $notes = null)
    {
        $this->quantity += $quantity;
        
        if ($notes) {
            $this->notes = ($this->notes ? $this->notes . "\n" : '') . 
                          now()->format('Y-m-d H:i:s') . ": +{$quantity} - {$notes}";
        }
        
        $this->save();
        
        // Mettre à jour le stock du produit
        $this->product->stock = WarehouseStock::where('product_id', $this->product_id)->sum('quantity');
        $this->product->save();
    }

    public function removeStock($quantity, $notes = null)
    {
        if ($this->available_quantity >= $quantity) {
            $this->quantity -= $quantity;
            
            if ($notes) {
                $this->notes = ($this->notes ? $this->notes . "\n" : '') . 
                              now()->format('Y-m-d H:i:s') . ": -{$quantity} - {$notes}";
            }
            
            $this->save();
            
            // Mettre à jour le stock du produit
            $this->product->stock = WarehouseStock::where('product_id', $this->product_id)->sum('quantity');
            $this->product->save();
            
            return true;
        }
        
        return false;
    }

    public function reserveStock($quantity)
    {
        if ($this->available_quantity >= $quantity) {
            $this->reserved_quantity += $quantity;
            $this->save();
            return true;
        }
        
        return false;
    }

    public function releaseReserved($quantity)
    {
        $releaseQuantity = min($quantity, $this->reserved_quantity);
        $this->reserved_quantity -= $releaseQuantity;
        $this->save();
        
        return $releaseQuantity;
    }

    public function confirmReservation($quantity)
    {
        $confirmQuantity = min($quantity, $this->reserved_quantity);
        $this->reserved_quantity -= $confirmQuantity;
        $this->quantity -= $confirmQuantity;
        $this->save();
        
        // Mettre à jour le stock du produit
        $this->product->stock = WarehouseStock::where('product_id', $this->product_id)->sum('quantity');
        $this->product->save();
        
        return $confirmQuantity;
    }
}
