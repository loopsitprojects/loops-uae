<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('press_releases', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Achievement');
            $table->date('published_date')->nullable();
            $table->string('author')->nullable()->default('Loops Integrated');
            $table->string('publisher')->nullable();
            $table->string('external_link', 1000)->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('image_url', 1000)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('press_releases');
    }
};
