<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\Service;
use App\Models\ServiceCapability;

return new class extends Migration
{
    public function up(): void
    {
        // Update sort order of events service so performance-marketing comes before events
        DB::table('services')->where('slug', 'events')->update(['sort_order' => 7]);

        // Insert or update performance-marketing service
        $service = Service::updateOrCreate(
            ['slug' => 'performance-marketing'],
            [
                'title' => 'Performance Marketing',
                'headline' => 'Data-driven strategies that turn ad spend into high-ROI revenue engines.',
                'subheadline' => 'Precision targeting, continuous optimization, and measurable growth across all paid channels.',
                'description' => 'We engineer data-driven performance marketing campaigns that eliminate guesswork and maximize ROI. From search and social ads to full-funnel attribution and automated growth engines, we transform media spend into predictable, scalable revenue for your business.',
                'what_we_do_text' => 'We blend analytical rigor with creative performance testing to scale customer acquisition, optimize ad spend, and maximize lifetime customer value across all digital channels.',
                'cta_label' => 'View Our Performance Work',
                'cta_link' => '/work?category=digital',
                'accent_color' => '#FF5722',
                'icon' => '📈',
                'sort_order' => 6,
                'published' => true,
                'meta_title' => 'Performance Marketing Services | Loops Integrated',
                'meta_description' => 'Scale revenue with data-driven performance marketing, PPC, paid social, CRO, and attribution analytics by Loops Integrated.',
            ]
        );

        // Seed capabilities for performance marketing
        $capabilities = [
            [
                'label' => 'Paid Search & PPC (Google Ads)',
                'description' => 'Capturing high-intent search traffic with highly targeted keywords, smart bidding, and conversion-focused copy.',
                'sort_order' => 1,
            ],
            [
                'label' => 'Paid Social Campaigns (Meta, LinkedIn, TikTok)',
                'description' => 'Driving acquisition across social platforms with dynamic audience targeting and high-converting ad creative.',
                'sort_order' => 2,
            ],
            [
                'label' => 'Conversion Rate Optimization (CRO)',
                'description' => 'Analyzing user friction and conducting multivariate landing page tests to turn existing traffic into paying customers.',
                'sort_order' => 3,
            ],
            [
                'label' => 'Data Analytics & Multi-Touch Attribution',
                'description' => 'Implementing clean data pipelines, event tracking, and attribution dashboards for complete ROI transparency.',
                'sort_order' => 4,
            ],
            [
                'label' => 'Programmatic & Retargeting Media',
                'description' => 'Re-engaging high-value prospective buyers across ad networks and premium publisher placements automatically.',
                'sort_order' => 5,
            ],
            [
                'label' => 'Funnel Automation & Growth Hacking',
                'description' => 'Automating email/SMS nurture sequences, customer lifecycle triggers, and rapid growth experiments.',
                'sort_order' => 6,
            ],
        ];

        foreach ($capabilities as $cap) {
            ServiceCapability::updateOrCreate(
                [
                    'service_id' => $service->id,
                    'label' => $cap['label'],
                ],
                [
                    'description' => $cap['description'],
                    'sort_order' => $cap['sort_order'],
                ]
            );
        }
    }

    public function down(): void
    {
        $service = Service::where('slug', 'performance-marketing')->first();
        if ($service) {
            $service->capabilities()->delete();
            $service->delete();
        }

        DB::table('services')->where('slug', 'events')->update(['sort_order' => 6]);
    }
};
