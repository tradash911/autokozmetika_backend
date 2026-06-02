<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->text('address')->nullable()->after('opening_hours');
            $table->string('phone_number')->nullable()->after('address');
            $table->string('email_address')->nullable()->after('phone_number');
            $table->string('tik_tok_url')->nullable()->after('email_address');
            $table->string('facebook_url')->nullable()->after('tik_tok_url');
            $table->string('instagram_url')->nullable()->after('facebook_url');
            $table->string('x_url')->nullable()->after('instagram_url');
            $table->string('youtube_url')->nullable()->after('x_url');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'address',
                'phone_number',
                'email_address',
                'tik_tok_url',
                'facebook_url',
                'instagram_url',
                'x_url',
                'youtube_url',
            ]);
        });
    }
};
