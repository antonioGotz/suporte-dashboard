<?php

namespace App\Http\Resources;

use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class SeparationResource extends JsonResource
{
    public function toArray($request): array
    {
        $nextShipment = $this->next_shipment_date ? Carbon::parse($this->next_shipment_date) : null;

        $baby = null;
        if ($this->relationLoaded('latest_child')) {
            $baby = $this->getRelation('latest_child');
        } elseif ($this->relationLoaded('user') && $this->user) {
            $baby = $this->user->children()->latest('id')->first();
        }

        $babyBirth = $baby && $baby->birth ? Carbon::parse($baby->birth) : null;
        $babyAgeMonths = null;
        if ($babyBirth && $nextShipment) {
            $babyAgeMonths = $babyBirth->diffInMonths($nextShipment);
        }

        $babyAgeLabel = null;
        if ($babyAgeMonths !== null) {
            if ($babyAgeMonths < 12) {
                $unit = $babyAgeMonths === 1 ? 'mes' : 'meses';
                $babyAgeLabel = sprintf('%d %s', $babyAgeMonths, $unit);
            } else {
                $years = intdiv($babyAgeMonths, 12);
                $remaining = $babyAgeMonths % 12;
                $parts = [];
                $parts[] = sprintf('%d %s', $years, $years === 1 ? 'ano' : 'anos');
                if ($remaining > 0) {
                    $parts[] = sprintf('%d %s', $remaining, $remaining === 1 ? 'mes' : 'meses');
                }
                $babyAgeLabel = implode(' e ', $parts);
            }
        }

        // Determina o brinquedo a ser enviado com base na idade do bebê na data de envio
        $productToSend = null;
        if ($babyAgeMonths !== null) {
            $productToSend = Product::where('age_ini', '<=', $babyAgeMonths)
                ->where('age_end', '>=', $babyAgeMonths)
                ->first();
        }

        // Fallback: caso não encontre por idade, usa o produto relacionado (plano)
        $relatedProduct = $this->relationLoaded('product') ? $this->product : null;
        $planName = $relatedProduct ? $relatedProduct->name : ($this->plan_name ?? null);

        $statusLabel = Order::normalizeSeparationStatus($this->separation_status);
        $statusCode = Order::separationStatusKey($statusLabel);
        // Efetivo: só considera "gerada" se a última geração não foi antes do último reset para Aguardando
        $lastGen = $this->last_label_generated_at ?? null;
        $lastReset = $this->last_reset_at ?? null;
        $labelGenerated = $lastGen !== null && ($lastReset === null || $lastGen > $lastReset);

        return [
            'order_id' => $this->order_id ?? $this->id,
            'subscriber_id' => $this->users_id,
            'status' => $statusLabel,
            'status_code' => $statusCode,
            'mother_name' => $this->mother_name ?? optional($this->user)->name,
            'mother_email' => optional($this->user)->email,
            // IDs auxiliares para evitar duplicidades por mesma mãe + mesmo bebê
            'child_id' => $baby ? $baby->id : null,
            'baby_name' => $baby->name ?? null,
            'baby_age_months' => $babyAgeMonths,
            'baby_age_label' => $babyAgeLabel,
            'next_shipment_date' => $nextShipment ? $nextShipment->toDateString() : null,
            'plan_name' => $planName,
            'product_to_send' => $productToSend ? [
                'id' => $productToSend->id,
                'name' => $productToSend->name,
            ] : ($relatedProduct ? [
                'id' => $relatedProduct->id,
                'name' => $relatedProduct->name,
            ] : null),
            'label_generated' => $labelGenerated,
        ];
    }
}
