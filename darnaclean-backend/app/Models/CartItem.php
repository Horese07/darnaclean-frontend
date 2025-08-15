<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'session_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * Relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scopes
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForSession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    /**
     * Mutators & Accessors
     */
    public function getTotalAttribute()
    {
        return $this->quantity * ($this->product ? $this->product->price : 0);
    }

    /**
     * Methods
     */
    public function updateQuantity($quantity)
    {
        if ($quantity <= 0) {
            $this->delete();
            return false;
        }

        // Vérifier la disponibilité du stock
        if ($this->product && $quantity > $this->product->stock) {
            $quantity = $this->product->stock;
        }

        $this->quantity = $quantity;
        $this->save();
        
        return true;
    }

    public function increaseQuantity($amount = 1)
    {
        return $this->updateQuantity($this->quantity + $amount);
    }

    public function decreaseQuantity($amount = 1)
    {
        return $this->updateQuantity($this->quantity - $amount);
    }

    public static function addOrUpdateItem($userId, $productId, $quantity, $sessionId = null)
    {
        $query = self::where('product_id', $productId);
        
        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', $sessionId);
        }

        $cartItem = $query->first();

        if ($cartItem) {
            $cartItem->updateQuantity($cartItem->quantity + $quantity);
        } else {
            $cartItem = self::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'session_id' => $sessionId,
            ]);
        }

        return $cartItem;
    }

    public static function getCartForUser($userId)
    {
        return self::with('product')
            ->forUser($userId)
            ->get();
    }

    public static function getCartForSession($sessionId)
    {
        return self::with('product')
            ->forSession($sessionId)
            ->get();
    }

    public static function clearCartForUser($userId)
    {
        return self::forUser($userId)->delete();
    }

    public static function clearCartForSession($sessionId)
    {
        return self::forSession($sessionId)->delete();
    }

    public static function migrateSessionToUser($sessionId, $userId)
    {
        // Récupérer les éléments du panier de session
        $sessionItems = self::forSession($sessionId)->get();
        
        foreach ($sessionItems as $sessionItem) {
            // Vérifier s'il existe déjà un élément pour ce produit et cet utilisateur
            $userItem = self::forUser($userId)
                ->where('product_id', $sessionItem->product_id)
                ->first();

            if ($userItem) {
                // Fusionner les quantités
                $userItem->updateQuantity($userItem->quantity + $sessionItem->quantity);
                $sessionItem->delete();
            } else {
                // Transférer l'élément à l'utilisateur
                $sessionItem->user_id = $userId;
                $sessionItem->session_id = null;
                $sessionItem->save();
            }
        }
    }
}
