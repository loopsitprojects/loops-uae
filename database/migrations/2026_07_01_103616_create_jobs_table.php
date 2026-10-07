<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('department', 100); // e.g. Creative, Tech, Digital, Accounts
            $table->string('location', 100)->default('Colombo, Sri Lanka'); // e.g. Colombo, Remote, Hybrid
            $table->string('type', 50)->default('Full-time'); // e.g. Full-time, Part-time, Internship, Contract
            $table->string('experience_level', 100)->nullable(); // e.g. Senior, Mid-level, Associate
            $table->text('description'); // Markdown content containing job details
            $table->string('apply_link', 500)->nullable(); // Optional external apply URL
            $table->string('apply_email', 255)->nullable(); // Optional careers contact email
            $table->integer('sort_order')->default(0);
            $table->boolean('published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
