<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'main_category_id',
        'name',
        'description',
        'price_normal',
        'price_medium',
        'price_large',
    ];

    public function mainCategory(): BelongsTo
    {
        return $this->belongsTo(MainCategory::class);
    }
}
