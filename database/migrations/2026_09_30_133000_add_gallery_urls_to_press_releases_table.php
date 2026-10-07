<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('press_releases', 'gallery_urls')) {
            Schema::table('press_releases', function (Blueprint $table) {
                $table->json('gallery_urls')->nullable()->after('video_url');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('press_releases', 'gallery_urls')) {
            Schema::table('press_releases', function (Blueprint $table) {
                $table->dropColumn('gallery_urls');
            });
        }
    }
};
