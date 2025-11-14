<?php

namespace App\Services\Shipping;

use App\Models\Order;

class ShippingProviderFake
{
    /**
     * Gera dados simulados de remessa para impressão de etiqueta.
     */
    public function createShipment(Order $order): array
    {
        $seed = $order->id . '|' . microtime(true);
        $hash = substr(sha1($seed), 0, 10);
        $tracking = 'TRK-' . strtoupper($hash);

        $previewUrl = url('/labels/preview') . '?tracking=' . urlencode($tracking);

        return [
            'carrier' => 'FakeCarrier',
            'tracking_code' => $tracking,
            // Pré-visualização em HTML imprimível (rota protegida)
            'label_url' => $previewUrl,
            'status' => 'ready_for_pickup',
        ];
    }
}
