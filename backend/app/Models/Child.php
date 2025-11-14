<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Child extends Model
{
    use HasFactory;

    /**
     * O nome da tabela associada ao model.
     */
    protected $table = 'children';

    /**
     * Os atributos que podem ser preenchidos em massa.
     */
    protected $fillable = [
        'id',
        'users_id',
        'name',
        'birth', // Assumindo que a coluna de data de nascimento se chama 'birth'
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     */
    protected $casts = [
        'birth' => 'date',
    ];

    /**
     * Um filho pertence a um usuário (mãe/pai).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}
