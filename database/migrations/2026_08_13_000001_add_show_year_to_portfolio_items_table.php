<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('portfolio_items', 'show_year')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->boolean('show_year')->default(false)->after('year');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('portfolio_items', 'show_year')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->dropColumn('show_year');
            });
        }
    }
};
