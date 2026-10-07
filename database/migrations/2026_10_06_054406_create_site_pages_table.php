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
        Schema::create('site_pages', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique();
            $table->string('label', 100);
            $table->string('url', 255);
            $table->string('nav_group', 50)->default('top'); // 'top', 'integrated', 'cta', 'hidden'
            $table->boolean('is_published')->default(true);
            $table->boolean('show_in_nav')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('icon', 50)->nullable();
            $table->string('description', 255)->nullable();
            $table->timestamps();
        });

        $now = now();
        $pages = [
            [
                'key' => 'work',
                'label' => 'Work',
                'url' => '/work',
                'nav_group' => 'top',
                'sort_order' => 1,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => null,
                'description' => 'Featured client works and case studies',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'about',
                'label' => 'About',
                'url' => '/about',
                'nav_group' => 'top',
                'sort_order' => 2,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => null,
                'description' => 'Agency story, leadership and awards',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'press',
                'label' => 'Press & Achievements',
                'url' => '/press',
                'nav_group' => 'top',
                'sort_order' => 3,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => null,
                'description' => 'Press releases, news and awards',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'careers',
                'label' => 'Careers',
                'url' => '/careers',
                'nav_group' => 'top',
                'sort_order' => 4,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => null,
                'description' => 'Open positions and life at Loops',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'creative',
                'label' => 'Creative',
                'url' => '/creative',
                'nav_group' => 'integrated',
                'sort_order' => 10,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '✦',
                'description' => 'Brand identity & campaigns',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'digital',
                'label' => 'Digital',
                'url' => '/digital',
                'nav_group' => 'integrated',
                'sort_order' => 11,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '◎',
                'description' => 'Performance & growth',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'tech',
                'label' => 'Tech',
                'url' => '/tech',
                'nav_group' => 'integrated',
                'sort_order' => 12,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '⬡',
                'description' => 'MarTech & automation',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'play',
                'label' => 'Play',
                'url' => '/play',
                'nav_group' => 'integrated',
                'sort_order' => 13,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '⌬',
                'description' => 'Productions & content',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'ai-content',
                'label' => 'AI Content',
                'url' => '/ai-content',
                'nav_group' => 'integrated',
                'sort_order' => 14,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '⬟',
                'description' => 'AI-powered content engine',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'performance-marketing',
                'label' => 'Performance Marketing',
                'url' => '/performance-marketing',
                'nav_group' => 'integrated',
                'sort_order' => 15,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '📈',
                'description' => 'Data-driven growth & ROI',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'events',
                'label' => 'Events & Experiences',
                'url' => '/events',
                'nav_group' => 'integrated',
                'sort_order' => 16,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => '⬢',
                'description' => 'Activations & management',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'contact',
                'label' => 'Contact',
                'url' => '/contact',
                'nav_group' => 'cta',
                'sort_order' => 20,
                'is_published' => true,
                'show_in_nav' => true,
                'icon' => null,
                'description' => 'Contact details and inquiry form',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'home',
                'label' => 'Home',
                'url' => '/',
                'nav_group' => 'hidden',
                'sort_order' => 0,
                'is_published' => true,
                'show_in_nav' => false,
                'icon' => null,
                'description' => 'Main landing page',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        \Illuminate\Support\Facades\DB::table('site_pages')->insert($pages);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_pages');
    }
};
