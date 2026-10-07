<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('client');
            $table->string('title');
            $table->text('brief');
            $table->text('insight');
            $table->text('idea');
            $table->string('result', 500)->nullable();
            $table->string('video_url', 500)->nullable();
            $table->unsignedSmallInteger('year');
            $table->string('color', 7)->default('#E8005A');
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            // SEO
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->json('json_ld')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['published', 'featured']);
            $table->index(['published', 'year']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
