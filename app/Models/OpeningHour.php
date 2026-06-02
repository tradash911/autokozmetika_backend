<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpeningHour extends Model
{
    protected $fillable = [
        'setting_id',
        'day',
        'open_at',
        'close_at',
    ];

    public function setting()
    {
        return $this->belongsTo(Setting::class);
    }
}
