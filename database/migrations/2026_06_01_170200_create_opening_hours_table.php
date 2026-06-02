<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opening_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('setting_id')->constrained()->cascadeOnDelete();
            $table->string('day')->nullable();
            $table->time('open_at')->nullable();
            $table->time('close_at')->nullable();
            $table->timestamps();

            $table->unique(['setting_id', 'day']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opening_hours');
    }
};
