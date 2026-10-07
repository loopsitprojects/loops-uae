<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('job_applications', 'cv_path')) {
                $table->string('cv_path', 255)->nullable()->after('cover_letter');
            }
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            if (Schema::hasColumn('job_applications', 'cv_path')) {
                $table->dropColumn('cv_path');
            }
        });
    }
};
