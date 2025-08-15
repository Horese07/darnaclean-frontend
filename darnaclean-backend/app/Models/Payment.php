<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REFUNDED = 'refunded';

    const METHOD_CARD = 'card';
    const METHOD_PAYPAL = 'paypal';
    const METHOD_COD = 'cash_on_delivery';

    protected $fillable = [
        'order_id',
        'user_id',
        'payment_method',
        'status',
        'amount',
        'currency',
        'gateway_transaction_id',
        'gateway_response',
        'gateway_fee',
        'processed_at',
        'failed_at',
        'cancelled_at',
        'refunded_at',
        'refund_amount',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_fee' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'gateway_response' => 'array',
        'processed_at' => 'datetime',
        'failed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    /**
     * Relations
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', self::STATUS_PROCESSING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', self::STATUS_REFUNDED);
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Mutators & Accessors
     */
    public function getStatusTextAttribute()
    {
        return __('payments.status.' . $this->status);
    }

    public function getMethodTextAttribute()
    {
        return __('payments.method.' . $this->payment_method);
    }

    public function getIsCompletedAttribute()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getIsRefundableAttribute()
    {
        return $this->status === self::STATUS_COMPLETED && !$this->refunded_at;
    }

    public function getNetAmountAttribute()
    {
        return $this->amount - ($this->gateway_fee ?? 0);
    }

    /**
     * Methods
     */
    public function markAsProcessing()
    {
        $this->status = self::STATUS_PROCESSING;
        $this->save();
    }

    public function markAsCompleted($transactionId = null, $gatewayResponse = null)
    {
        $this->status = self::STATUS_COMPLETED;
        $this->processed_at = now();
        
        if ($transactionId) {
            $this->gateway_transaction_id = $transactionId;
        }
        
        if ($gatewayResponse) {
            $this->gateway_response = $gatewayResponse;
        }
        
        $this->save();

        // Mettre à jour le statut de paiement de la commande
        $this->order->updatePaymentStatus(Order::PAYMENT_PAID);
    }

    public function markAsFailed($reason = null, $gatewayResponse = null)
    {
        $this->status = self::STATUS_FAILED;
        $this->failed_at = now();
        
        if ($reason) {
            $this->notes = $reason;
        }
        
        if ($gatewayResponse) {
            $this->gateway_response = $gatewayResponse;
        }
        
        $this->save();

        // Mettre à jour le statut de paiement de la commande
        $this->order->updatePaymentStatus(Order::PAYMENT_FAILED);
    }

    public function markAsCancelled($reason = null)
    {
        $this->status = self::STATUS_CANCELLED;
        $this->cancelled_at = now();
        
        if ($reason) {
            $this->notes = $reason;
        }
        
        $this->save();
    }

    public function processRefund($amount = null, $reason = null)
    {
        if (!$this->is_refundable) {
            return false;
        }

        $refundAmount = $amount ?? $this->amount;
        
        if ($refundAmount > $this->amount) {
            return false;
        }

        $this->status = self::STATUS_REFUNDED;
        $this->refunded_at = now();
        $this->refund_amount = $refundAmount;
        
        if ($reason) {
            $this->notes = ($this->notes ? $this->notes . "\n" : '') . "Remboursement: {$reason}";
        }
        
        $this->save();

        // Mettre à jour le statut de paiement de la commande
        if ($refundAmount >= $this->amount) {
            $this->order->updatePaymentStatus(Order::PAYMENT_REFUNDED);
            $this->order->updateStatus(Order::STATUS_REFUNDED);
        }

        return true;
    }

    public static function getStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_COMPLETED,
            self::STATUS_FAILED,
            self::STATUS_CANCELLED,
            self::STATUS_REFUNDED,
        ];
    }

    public static function getMethods()
    {
        return [
            self::METHOD_CARD,
            self::METHOD_PAYPAL,
            self::METHOD_COD,
        ];
    }
}
