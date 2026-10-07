<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('awards', function (Blueprint $table) {
            $table->id();
            $table->enum('tier', ['Gold', 'Silver', 'Bronze']);
            $table->tinyInteger('count')->unsigned()->default(1);
            $table->string('award_body');
            $table->unsignedSmallInteger('year');
            $table->string('campaign_name');
            $table->string('client_name')->nullable();
            $table->string('category');
            $table->text('insight')->nullable();
            $table->boolean('published')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->foreignId('portfolio_item_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('awards');
    }
};
