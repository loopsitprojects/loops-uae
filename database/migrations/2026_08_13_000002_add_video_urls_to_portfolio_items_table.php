<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('portfolio_items', 'video_urls')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->json('video_urls')->nullable()->after('video_url');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('portfolio_items', 'video_urls')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->dropColumn('video_urls');
            });
        }
    }
};
