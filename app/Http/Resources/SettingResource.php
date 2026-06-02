<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'address' => $this->address,
            'phone_number' => $this->phone_number,
            'email_address' => $this->email_address,
            'tik_tok_url' => $this->tik_tok_url,
            'facebook_url' => $this->facebook_url,
            'instagram_url' => $this->instagram_url,
            'x_url' => $this->x_url,
            'youtube_url' => $this->youtube_url,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
