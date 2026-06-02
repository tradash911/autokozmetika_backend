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
        if (Schema::hasColumn('categories', 'stock')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropColumn('stock');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('categories', 'stock')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->unsignedInteger('stock')->default(0);
            });
        }
    }
};
