<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model
{
    protected $table = 'actions_log';

    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'user_id',
        'action',     // 'suspenso' | 'cancelado' | 'reativado' | etc.
        'quantity',
        'reason',
        'action_by',  // admin que executou
        'created_at',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'action_by');
    }
}
