<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'order_id',
        'rating',
        'title',
        'comment',
        'is_verified_purchase',
        'is_approved',
        'approved_at',
        'approved_by',
        'helpful_count',
        'not_helpful_count',
    ];

    protected $casts = [
        'rating' => 'decimal:1',
        'is_verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    /**
     * Relations
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    public function scopeVerifiedPurchase($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeHelpful($query)
    {
        return $query->orderBy('helpful_count', 'desc');
    }

    /**
     * Mutators & Accessors
     */
    public function getUserDisplayNameAttribute()
    {
        if ($this->user) {
            return $this->user->first_name . ' ' . substr($this->user->last_name, 0, 1) . '.';
        }
        return 'Client anonyme';
    }

    public function getHelpfulPercentageAttribute()
    {
        $total = $this->helpful_count + $this->not_helpful_count;
        
        if ($total === 0) {
            return 0;
        }
        
        return round(($this->helpful_count / $total) * 100);
    }

    public function getRatingStarsAttribute()
    {
        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    /**
     * Methods
     */
    public function approve($approvedBy = null)
    {
        $this->is_approved = true;
        $this->approved_at = now();
        $this->approved_by = $approvedBy;
        $this->save();

        // Mettre à jour la note moyenne du produit
        $this->product->updateRating();
    }

    public function reject()
    {
        $this->is_approved = false;
        $this->approved_at = null;
        $this->approved_by = null;
        $this->save();

        // Mettre à jour la note moyenne du produit
        $this->product->updateRating();
    }

    public function markHelpful()
    {
        $this->helpful_count++;
        $this->save();
    }

    public function markNotHelpful()
    {
        $this->not_helpful_count++;
        $this->save();
    }

    public static function canUserReview($userId, $productId)
    {
        // Vérifier si l'utilisateur a acheté ce produit
        $hasPurchased = OrderItem::whereHas('order', function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->where('status', Order::STATUS_DELIVERED);
        })->where('product_id', $productId)->exists();

        if (!$hasPurchased) {
            return false;
        }

        // Vérifier si l'utilisateur n'a pas déjà écrit un avis
        $hasReviewed = self::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();

        return !$hasReviewed;
    }

    public static function getAverageRating($productId)
    {
        return self::where('product_id', $productId)
            ->approved()
            ->avg('rating') ?? 0;
    }

    public static function getRatingDistribution($productId)
    {
        $distribution = [];
        
        for ($i = 1; $i <= 5; $i++) {
            $count = self::where('product_id', $productId)
                ->approved()
                ->where('rating', $i)
                ->count();
            
            $distribution[$i] = $count;
        }
        
        return $distribution;
    }
}
