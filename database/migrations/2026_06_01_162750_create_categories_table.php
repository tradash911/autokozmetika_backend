<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('main_category_id')->constrained('main_categories')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
                $table->decimal('price_normal', 10, 2)->default(0);
                $table->decimal('price_medium', 10, 2)->default(0);
                $table->decimal('price_large', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
