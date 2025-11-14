<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Scopes\TenantScope;

class Order extends Model
{
    use HasFactory;

    // protected static function booted()
    // {
    //     static::addGlobalScope(new \App\Models\Scopes\TenantScope);
    // }

    protected $table = 'orders';

    protected $fillable = [
        'id',
        'users_id',
        'products_id',
        'status',    // 'active' | 'canceled'
        'separation_status',
        'amount',    // se existir na tabela
        // adicione outros campos preenchíveis se precisar
    ];

    protected $attributes = [
        'separation_status' => self::SEPARATION_STATUS_PENDING,
    ];

    public const STATUS_ACTIVE = 'active';

    public const STATUS_CANCELED = 'canceled';

    public const SEPARATION_STATUS_PENDING = 'Aguardando Separação';

    public const SEPARATION_STATUS_IN_PROGRESS = 'Em Separação';

    public const SEPARATION_STATUS_READY = 'Pendente de Envio';

    public const SEPARATION_STATUS_SHIPPED = 'Enviado/Coletado';

    public static function separationStatusMap(): array
    {
        return [
            'waiting' => self::SEPARATION_STATUS_PENDING,
            'in_progress' => self::SEPARATION_STATUS_IN_PROGRESS,
            'ready' => self::SEPARATION_STATUS_READY,
            'shipped' => self::SEPARATION_STATUS_SHIPPED,
        ];
    }

    public static function separationStatusLabels(): array
    {
        return array_values(self::separationStatusMap());
    }

    public static function normalizeSeparationStatus(?string $status): string
    {
        if (! $status) {
            return self::SEPARATION_STATUS_PENDING;
        }

        if (in_array($status, self::separationStatusLabels(), true)) {
            return $status;
        }

        $legacy = strtolower(trim($status));

        return match ($legacy) {
            'enviado', 'entregue', 'enviado/coletado', 'coletado' => self::SEPARATION_STATUS_SHIPPED,
            'pronto para envio', 'pronto p/ coleta', 'pronto para coleta', 'pronto p coleta' => self::SEPARATION_STATUS_READY,
            'em separacao', 'separacao' => self::SEPARATION_STATUS_IN_PROGRESS,
            default => self::SEPARATION_STATUS_PENDING,
        };
    }

    public static function separationStatusKey(string $status): string
    {
        $status = self::normalizeSeparationStatus($status);

        foreach (self::separationStatusMap() as $key => $label) {
            if ($label === $status) {
                return $key;
            }
        }

        return 'waiting';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'products_id');
    }

    public function actionLogs(): HasMany
    {
        return $this->hasMany(ActionLog::class, 'order_id');
    }
}
