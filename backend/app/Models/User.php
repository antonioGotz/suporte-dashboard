<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'adm', // flag admin (0/1)
        'cep',
        'address',
        'number',
        'complete',
        'neighborhood',
        'city',
        'state',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'adm' => 'boolean',
        // Laravel 10+ aplica hash automático ao atribuir password
        'password' => 'hashed',
    ];

    // Ajudante: $user->is_admin
    public function getIsAdminAttribute(): bool
    {
        return (bool) $this->adm;
    }

    // Um usuário possui várias assinaturas (orders)
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'users_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'users_id');
    }
}
