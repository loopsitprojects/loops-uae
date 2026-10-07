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
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->string('webhook_status')->default('pending')->after('ip_address');
            $table->timestamp('webhook_synced_at')->nullable()->after('webhook_status');
            $table->text('webhook_response')->nullable()->after('webhook_synced_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn(['webhook_status', 'webhook_synced_at', 'webhook_response']);
        });
    }
};
