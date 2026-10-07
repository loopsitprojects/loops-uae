<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('email', 255);
            $table->string('phone', 50);
            $table->text('cover_letter')->nullable();
            $table->string('status', 50)->default('new'); // e.g. new, reviewed, shortlisted, rejected, hired
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
