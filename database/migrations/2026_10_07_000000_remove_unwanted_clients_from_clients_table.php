<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Client;

return new class extends Migration
{
    public function up(): void
    {
        $keywords = [
            'MAS',
            'Softlogic',
            'Havelock',
            'Dialog',
            'Hemas',
            'Commercial Bank',
            'Keells',
            'Cargills',
            'Sampath Bank',
            'CEAT',
            'Elephant House',
            'Elephant',
        ];

        try {
            $clients = Client::where(function ($query) use ($keywords) {
                foreach ($keywords as $kw) {
                    $query->orWhere('name', 'like', '%' . $kw . '%');
                }
            })->get();

            foreach ($clients as $client) {
                $client->delete();
            }
        } catch (\Throwable $e) {
            // Ignore if clients table is not present yet
        }
    }

    public function down(): void
    {
        // No reverse migration needed
    }
};
