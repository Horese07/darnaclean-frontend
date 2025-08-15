<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REFUNDED = 'refunded';

    const PAYMENT_PENDING = 'pending';
    const PAYMENT_PAID = 'paid';
    const PAYMENT_FAILED = 'failed';
    const PAYMENT_REFUNDED = 'refunded';

    const PAYMENT_METHOD_CARD = 'card';
    const PAYMENT_METHOD_PAYPAL = 'paypal';
    const PAYMENT_METHOD_COD = 'cash_on_delivery';

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'payment_method',
        'payment_intent_id',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'total_amount',
        'currency',
        'notes',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'shipping_address',
        'billing_address',
        'delivery_zone_id',
        'tracking_number',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'shipping_address' => 'array',
        'billing_address' => 'array',
    ];

    /**
     * Relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function deliveryZone()
    {
        return $this->belongsTo(DeliveryZone::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', self::STATUS_PROCESSING);
    }

    public function scopeShipped($query)
    {
        return $query->where('status', self::STATUS_SHIPPED);
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PAID);
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', '!=', self::PAYMENT_PAID);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Mutators & Accessors
     */
    public function getStatusTextAttribute()
    {
        return __('orders.status.' . $this->status);
    }

    public function getPaymentStatusTextAttribute()
    {
        return __('orders.payment_status.' . $this->payment_status);
    }

    public function getItemsCountAttribute()
    {
        return $this->items->sum('quantity');
    }

    public function getCanBeCancelledAttribute()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }

    public function getCanBeRefundedAttribute()
    {
        return $this->payment_status === self::PAYMENT_PAID && 
               !in_array($this->status, [self::STATUS_CANCELLED, self::STATUS_REFUNDED]);
    }

    /**
     * Methods
     */
    public function generateOrderNumber()
    {
        $prefix = 'DC';
        $date = now()->format('Ymd');
        $sequence = str_pad($this->id, 4, '0', STR_PAD_LEFT);
        
        $this->order_number = $prefix . $date . $sequence;
        $this->save();
    }

    public function calculateTotals()
    {
        $subtotal = $this->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        $this->subtotal = $subtotal;
        $this->tax_amount = $subtotal * 0.20; // 20% TVA
        $this->shipping_amount = $this->calculateShippingAmount();
        $this->total_amount = $this->subtotal + $this->tax_amount + $this->shipping_amount - $this->discount_amount;
        
        $this->save();
    }

    public function calculateShippingAmount()
    {
        // Livraison gratuite dès 200 MAD
        if ($this->subtotal >= 200) {
            return 0;
        }

        // Tarif selon zone de livraison
        if ($this->deliveryZone) {
            return $this->deliveryZone->shipping_cost;
        }

        return 30; // Tarif par défaut
    }

    public function updateStatus($status, $notes = null)
    {
        $this->status = $status;
        
        if ($notes) {
            $this->notes = ($this->notes ? $this->notes . "\n" : '') . $notes;
        }

        switch ($status) {
            case self::STATUS_SHIPPED:
                $this->shipped_at = now();
                break;
            case self::STATUS_DELIVERED:
                $this->delivered_at = now();
                break;
            case self::STATUS_CANCELLED:
                $this->cancelled_at = now();
                break;
        }

        $this->save();
    }

    public function updatePaymentStatus($status)
    {
        $this->payment_status = $status;
        $this->save();
    }

    public function cancel($reason = null)
    {
        if ($this->can_be_cancelled) {
            $this->updateStatus(self::STATUS_CANCELLED, $reason);
            
            // Restaurer le stock
            foreach ($this->items as $item) {
                $item->product->increaseStock($item->quantity);
            }
            
            return true;
        }
        
        return false;
    }

    public static function getStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_PROCESSING,
            self::STATUS_SHIPPED,
            self::STATUS_DELIVERED,
            self::STATUS_CANCELLED,
            self::STATUS_REFUNDED,
        ];
    }

    public static function getPaymentStatuses()
    {
        return [
            self::PAYMENT_PENDING,
            self::PAYMENT_PAID,
            self::PAYMENT_FAILED,
            self::PAYMENT_REFUNDED,
        ];
    }

    public static function getPaymentMethods()
    {
        return [
            self::PAYMENT_METHOD_CARD,
            self::PAYMENT_METHOD_PAYPAL,
            self::PAYMENT_METHOD_COD,
        ];
    }
}
