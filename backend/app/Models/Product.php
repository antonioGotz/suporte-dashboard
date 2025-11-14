<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Scopes\TenantScope;
use Illuminate\Support\Collection;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // protected static function booted()
    // {
    //     static::addGlobalScope(new \App\Models\Scopes\TenantScope);
    // }

    /**
     * Os atributos que podem ser preenchidos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
        'video',
        'signature', // Importante para a função listSubscriptionPlans
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
        'signature' => 'boolean',
    ];

    /**
     * Cache simples por request para mapeamento de faixas etárias.
     * Retorna coleção com campos mínimos necessários.
     */
    public static function byAgeRangeCached(): Collection
    {
        static $cache;
        if ($cache instanceof Collection) {
            return $cache;
        }

        $cache = static::query()
            ->select(['id', 'name', 'age_ini', 'age_end'])
            ->whereNotNull('age_ini')
            ->whereNotNull('age_end')
            ->orderBy('age_ini')
            ->get();

        return $cache;
    }

    /**
     * Encontra o produto cuja faixa etária contém o valor informado.
     * Critério: primeiro match por ordem crescente de age_ini.
     */
    public static function matchByAge(int $months): ?self
    {
        return static::byAgeRangeCached()
            ->first(function ($p) use ($months) {
                return $p->age_ini <= $months && $p->age_end >= $months;
            });
    }
}
