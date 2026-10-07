<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Award;

return new class extends Migration
{
    public function up(): void
    {
        // Delete old generic/placeholder SLIM DIGIS entries
        Award::where('award_body', 'like', '%SLIM%')->delete();

        $slimAwards = [
            // SLIM Digis 2.1 (2021)
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Gold',
                'count' => 1,
                'year' => 2021,
                'category' => 'Best Use of Branded Content 2020',
                'campaign_name' => 'Creating the most viewed branded content ever',
                'client_name' => 'Sri Lankan Airlines (Client: Sri Lankan Airlines | Agency: Loops Digital (Pvt) Ltd)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 1,
            ],
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Gold',
                'count' => 1,
                'year' => 2021,
                'category' => 'Banking / Finance',
                'campaign_name' => 'This could be you',
                'client_name' => 'Softlogic Invest (Client: Softlogic Asset Management (Pvt) Ltd | Agency: Loops Digital (Pvt) Ltd)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 2,
            ],

            // SLIM Digis 2.2 (2022)
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Bronze',
                'count' => 1,
                'year' => 2022,
                'category' => 'Small Budget Impact',
                'campaign_name' => 'Tiny Packages Fulfill Big Dreams',
                'client_name' => 'Softlogic Invest (Client: Softlogic Asset Management (Pvt) Ltd | Agency: Loops Integrated Pvt Ltd)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 3,
            ],
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Bronze',
                'count' => 1,
                'year' => 2022,
                'category' => 'Best Use of Branded Content',
                'campaign_name' => 'Not An Insurance Commercial But A Story Of Miraculous Healing',
                'client_name' => 'Softlogic Life (Client: Softlogic Life Insurance PLC | Agency: MullenLowe Sri Lanka, Loops Integrated, New Media Solutions)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 4,
            ],
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Bronze',
                'count' => 1,
                'year' => 2022,
                'category' => 'Banking / Finance',
                'campaign_name' => 'Money, Money, Money!',
                'client_name' => 'Softlogic Invest (Client: Softlogic Asset Management (Pvt) Ltd | Agency: Loops Integrated (PVT) Ltd)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 5,
            ],

            // SLIM Digis 2.3 (2023)
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Bronze',
                'count' => 1,
                'year' => 2023,
                'category' => 'Banking / Finance',
                'campaign_name' => 'Who is Albert Uncle?',
                'client_name' => 'Seylan Bank (Client: Seylan Bank PLC | Agency: Loops Integrated Pvt Ltd, Ogilvy PR)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 6,
            ],
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Bronze',
                'count' => 1,
                'year' => 2023,
                'category' => 'Insurance',
                'campaign_name' => 'Unlocking Access To Miraculous Healing',
                'client_name' => 'Softlogic Life (Client: Softlogic Life Insurance PLC | Agency: MullenLowe Private Limited, Loops Integrated, New media solutions)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 7,
            ],

            // SLIM Digis 2.4 (2024)
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Silver',
                'count' => 1,
                'year' => 2024,
                'category' => 'Cross Digital Platform Integration',
                'campaign_name' => 'From the Earth to the Cloud',
                'client_name' => 'Softlogic Life (Client: Softlogic Life | Agency: Loops Integrated Pvt Ltd, MullenLowe Sri Lanka, New Media Solutions)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 8,
            ],
            [
                'award_body' => 'SLIM Digis',
                'tier' => 'Silver',
                'count' => 1,
                'year' => 2024,
                'category' => 'Best Use of Experiential Digital Marketing',
                'campaign_name' => 'DFCC Galaxy Virtual Branch',
                'client_name' => 'DFCC Bank (Client: DFCC Bank PLC | Agency: Loops Integrated (Pvt) Ltd)',
                'background_path' => '/images/awards/slim-digis-2021-nobg.png',
                'published' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($slimAwards as $data) {
            Award::create($data);
        }
    }

    public function down(): void
    {
        Award::where('award_body', 'SLIM Digis')->delete();
    }
};
