<?php
namespace App\Providers;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        \App\Models\User::class => \App\Policies\SubscriberPolicy::class,
        \App\Models\Order::class => \App\Policies\SeparationPolicy::class,
        \App\Models\Product::class => \App\Policies\ProductPolicy::class,
    ];

    public function boot(): void
    {
        // Garante o registro das policies mapeadas em $policies
        $this->registerPolicies();

        Gate::define('admin', function ($user) {
            return (bool) $user->adm;
        });
    }
}
