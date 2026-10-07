<?php

namespace Database\Seeders;

use App\Models\PressRelease;
use Illuminate\Database\Seeder;

class PressReleaseSeeder extends Seeder
{
    public function run(): void
    {
        PressRelease::truncate();

        $hasVideoUrl = \Illuminate\Support\Facades\Schema::hasColumn('press_releases', 'video_url');
        $hasGalleryUrls = \Illuminate\Support\Facades\Schema::hasColumn('press_releases', 'gallery_urls');

        // 1. SLIM DIGIS 2.6 Grand Prix & 13 Wins (Award Win) - Primary Featured
        $slimData = [
            'title' => 'Loops Integrated Celebrates Grand Prix Glory at SLIM DIGIS 2.6, Alongside 13 More Wins',
            'slug' => 'loops-integrated-celebrates-grand-prix-glory-at-slim-digis-2-6',
            'category' => 'Award Win',
            'published_date' => '2026-09-24',
            'author' => null,
            'publisher' => 'Loops Integrated',
            'external_link' => null,
            'excerpt' => 'Loops Integrated claimed the coveted Grand Prix at SLIM DIGIS 2.6, alongside 3 Gold Awards and 10 additional wins, bringing its total haul to 14 awards and further strengthening its position among Sri Lanka’s leading creative-led integrated marketing agencies.',
            'content' => "Loops Integrated claimed the coveted Grand Prix at SLIM DIGIS 2.6, alongside 3 Gold Awards and 10 additional wins, bringing its total haul to 14 awards and further strengthening its position among Sri Lanka’s leading creative-led integrated marketing agencies. The agency was recognised for multiple campaigns developed for prestigious brands including Thyaga, Softlogic Life and DFCC, with the Grand Prix awarded for the Thyaga “Kuna Boss” campaign. The 14 recognitions span 3 Gold, 1 Silver, 6 Bronze, and 3 Merit Awards, demonstrating the breadth and quality of the agency’s work. Campaigns such as “Bad Example” and “Hope Carols” for Softlogic Life, and DFCC Bank’s “Don’t Be Fooled” were among the award-winning work by Loops Integrated.\n\nCommenting on the achievement, Anoj Wijayaratne – Executive Director said, “We’re immensely proud of this achievement. It belongs to the teams who consistently push the work forward and to the clients who trust us enough to give bold ideas the space to become meaningful work. Awards are an important recognition of what we have accomplished, but they are also a reminder to keep raising the bar. Our focus now is on what comes next; sharper thinking, more ambitious partnerships and work that proves this level of excellence is our standard, not our ceiling.”\n\nThe SLIM DIGIS Awards, widely regarded as Sri Lanka’s premier awards programmes for Digital Marketing, is organised by the Sri Lanka Institute of Marketing. The platform brings together leading brands and agencies, while recognising campaigns that demonstrate genuine creativity, innovation and measurable impact.\n\nThe 14 awards at SLIM DIGIS 2.6 for Loops Integrated add to the agency’s extensive repertoire of recognised work in digital and integrated marketing on top of the 4 Awards at the Dragons of Sri Lanka Awards earlier in the year. 2025 marks another award-winning year for the agency, its clients and the diverse teams behind the work.\n\nAbout Loops Integrated\n\nHeadquartered in Sri Lanka and operating across seven countries, Loops Integrated has grown into an international integrated marketing agency delivering creative, strategic and technology-led solutions for brands around the world.\n\nWith a portfolio spanning more than 250 brands across 15 countries, Loops Integrated has earned over 60 prestigious local and international awards for creative and marketing excellence. This recognition reflects the agency’s commitment to work that is not only creatively ambitious, but strategically effective, reinforcing its position as a globally relevant, creative-led integrated marketing partner.",
            'image_url' => '/images/press/loops-slim-digis-team.jpg',
            'is_featured' => true,
            'published' => true,
            'sort_order' => 1,
        ];

        if ($hasVideoUrl) {
            $slimData['video_url'] = null;
        }

        PressRelease::create($slimData);

        // 2. Dubai AI Campus Office Opening (Achievement)
        $dubaiData = [
            'title' => 'Loops Opens New Office at Dubai AI Campus, Strengthening Its MENA Presence',
            'slug' => 'loops-opens-new-office-at-dubai-ai-campus-strengthening-its-mena-presence',
            'category' => 'Achievement',
            'published_date' => '2026-09-20',
            'author' => null,
            'publisher' => 'Loops Integrated',
            'external_link' => null,
            'excerpt' => 'Loops Integrated has opened its new Dubai office at the prestigious Dubai AI Campus in the Dubai International Financial Centre (DIFC), strengthening its regional presence and commitment to serving clients across the Middle East and North Africa (MENA).',
            'content' => "Loops Integrated has opened its new Dubai office at the prestigious Dubai AI Campus in the Dubai International Financial Centre (DIFC), strengthening its regional presence and commitment to serving clients across the Middle East and North Africa (MENA).\n\nThe opening builds on 12 years of work in the region, particularly in Qatar and the UAE. Establishing a permanent base in Dubai brings Loops closer to its clients, supporting stronger collaboration and new opportunities for growth.\n\nThe office will offer brands access to Loops’ expertise in digital marketing, creative strategy, video production, AI-powered content and marketing technology, combining regional insight with the agency’s creative and delivery capabilities.\n\nPritesh Kotecha, Loops’ partner overseeing business development in the UAE, will play a key role in developing client relationships and expanding the agency’s presence in the market.\n\nThe move marks an important milestone for Loops as it deepens its investment in the region and helps MENA brands connect with audiences through creativity, technology and innovation.",
            'image_url' => '/images/press/dubai-ai-campus-team.jpg',
            'is_featured' => false,
            'published' => true,
            'sort_order' => 2,
        ];

        if ($hasVideoUrl) {
            $dubaiData['video_url'] = null;
        }

        if ($hasGalleryUrls) {
            $dubaiData['gallery_urls'] = [
                ['url' => '/images/press/dubai-ai-campus-team.jpg', 'caption' => 'Loops Leadership at Dubai AI Campus, DIFC'],
                ['url' => '/images/press/dubai-ai-campus-workspace.jpg', 'caption' => 'State-of-the-Art Workspaces at Dubai AI Campus'],
            ];
        }

        PressRelease::create($dubaiData);
    }
}
