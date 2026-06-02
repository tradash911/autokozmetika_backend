<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'address',
        'phone_number',
        'email_address',
        'tik_tok_url',
        'facebook_url',
        'instagram_url',
        'x_url',
        'youtube_url',
    ];
}
