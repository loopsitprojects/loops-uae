<?php

namespace App\Filament\Widgets;

use App\Models\Award;
use App\Models\ContactSubmission;
use App\Models\PortfolioItem;
use App\Models\Redirect;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $unreadSubmissions = ContactSubmission::whereNull('read_at')->count();
        $totalSubmissions = ContactSubmission::count();
        $totalWork = PortfolioItem::count();
        $totalAwards = Award::sum('count');
        $totalRedirectHits = Redirect::sum('hits');

        return [
            Stat::make('New Enquiries', $unreadSubmissions)
                ->description("Total received: {$totalSubmissions}")
                ->descriptionIcon('heroicon-m-envelope')
                ->color('primary')
                ->chart([3, 5, 2, 7, 5, 8, $unreadSubmissions]),

            Stat::make('Portfolio Case Studies', $totalWork)
                ->description('Active agency work')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('success')
                ->chart([2, 2, 4, 3, 5, 4, $totalWork]),

            Stat::make('Awards Won', $totalAwards)
                ->description("From The Four A's")
                ->descriptionIcon('heroicon-m-trophy')
                ->color('warning')
                ->chart([1, 2, 2, 3, 4, 5, $totalAwards]),

            Stat::make('Redirect Traffic', $totalRedirectHits)
                ->description('SEO hits preserved')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info')
                ->chart([15, 30, 45, 60, 90, 110, $totalRedirectHits]),
        ];
    }
}
