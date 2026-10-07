<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->string('slug')->nullable()->change();
            $table->string('client')->nullable()->change();
            $table->string('title')->nullable()->change();
            $table->text('brief')->nullable()->change();
            $table->text('insight')->nullable()->change();
            $table->text('idea')->nullable()->change();
            $table->unsignedSmallInteger('year')->nullable()->change();
            $table->string('color', 7)->nullable()->change();
            $table->string('image_position', 50)->nullable()->change();
            $table->string('image_fit', 50)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            //
        });
    }
};
