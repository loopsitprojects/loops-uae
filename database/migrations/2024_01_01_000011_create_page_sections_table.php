<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page', 100);   // home, contact, work, etc.
            $table->string('section', 100); // hero, stats, newsletter_cta, etc.
            $table->json('data');           // arbitrary structured content
            $table->boolean('published')->default(true);
            $table->timestamps();

            $table->unique(['page', 'section']);
            $table->index('page');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
