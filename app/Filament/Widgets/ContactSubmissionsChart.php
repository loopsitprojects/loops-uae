<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use Filament\Widgets\ChartWidget;

class ContactSubmissionsChart extends ChartWidget
{
    protected ?string $heading = 'Daily Enquiry Volume (Last 10 Days)';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = [];
        $labels = [];
        
        for ($i = 9; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $labels[] = $date->format('M d');
            
            $count = ContactSubmission::whereDate('created_at', $date->toDateString())->count();
            $data[] = $count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Enquiries',
                    'data' => $data,
                    'fill' => 'start',
                    'tension' => 0.35,
                    'backgroundColor' => 'rgba(232, 0, 90, 0.1)',
                    'borderColor' => '#E8005A',
                    'borderWidth' => 3,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
