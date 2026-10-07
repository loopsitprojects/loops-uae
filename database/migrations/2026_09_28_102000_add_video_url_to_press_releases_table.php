<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('press_releases', 'video_url')) {
            Schema::table('press_releases', function (Blueprint $table) {
                $table->string('video_url', 1000)->nullable()->after('image_url');
            });
        }
    }

    public function down(): void
    {
        Schema::table('press_releases', function (Blueprint $table) {
            $table->dropColumn('video_url');
        });
    }
};
