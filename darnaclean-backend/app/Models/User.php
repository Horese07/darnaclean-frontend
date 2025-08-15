<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name', 
        'email',
        'phone',
        'password',
        'email_verified_at',
        'is_admin',
        'avatar',
        'date_of_birth',
        'gender',
        'preferred_language',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'date_of_birth' => 'date',
    ];

    /**
     * Relations
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function shippingAddresses()
    {
        return $this->hasMany(ShippingAddress::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Product::class, 'user_favorites');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Scopes
     */
    public function scopeAdmins($query)
    {
        return $query->where('is_admin', true);
    }

    public function scopeCustomers($query)
    {
        return $query->where('is_admin', false);
    }

    /**
     * Mutators & Accessors
     */
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Methods
     */
    public function isAdmin()
    {
        return $this->is_admin;
    }

    public function getCartTotal()
    {
        return $this->cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });
    }

    public function getCartItemsCount()
    {
        return $this->cartItems->sum('quantity');
    }
}
