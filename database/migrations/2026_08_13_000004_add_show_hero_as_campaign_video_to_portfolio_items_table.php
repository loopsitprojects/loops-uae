<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('portfolio_items', 'show_hero_as_campaign_video')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->boolean('show_hero_as_campaign_video')->default(true)->after('video_url');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('portfolio_items', 'show_hero_as_campaign_video')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->dropColumn('show_hero_as_campaign_video');
            });
        }
    }
};
