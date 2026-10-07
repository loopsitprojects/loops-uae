<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('portfolio_items', 'gallery_urls')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->json('gallery_urls')->nullable()->after('show_gallery');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('portfolio_items', 'gallery_urls')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->dropColumn('gallery_urls');
            });
        }
    }
};
