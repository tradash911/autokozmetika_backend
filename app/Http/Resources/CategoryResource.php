<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'main_category_id' => $this->main_category_id,
            'name' => $this->name,
            'description' => $this->description,
            'price_normal' => $this->price_normal,
            'price_medium' => $this->price_medium,
            'price_large' => $this->price_large,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
