<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('title', 100);
            $table->string('headline', 500);
            $table->string('subheadline', 500);
            $table->text('description');
            $table->string('cta_label', 100)->default('View Our Work');
            $table->string('cta_link', 255)->default('/work');
            $table->string('accent_color', 7)->default('#E8005A');
            $table->string('icon', 10)->default('◈');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('published')->default(true);
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
