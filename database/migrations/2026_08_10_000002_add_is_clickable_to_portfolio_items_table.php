<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('portfolio_items', 'is_clickable')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->boolean('is_clickable')->default(true)->after('published');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('portfolio_items', 'is_clickable')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->dropColumn('is_clickable');
            });
        }
    }
};
