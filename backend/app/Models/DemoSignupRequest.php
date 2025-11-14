<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemoSignupRequest extends Model
{
    use HasFactory;

    protected $table = 'demo_signup_requests';

    protected $fillable = [
        'user_id',
        'suggested_order_id',
        'order_id',
        'products_id',
        'amount',
        'origin',
        'payload',
        'completed_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'completed_at' => 'datetime',
        'amount' => 'float',
        'suggested_order_id' => 'integer',
        'order_id' => 'integer',
        'products_id' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
