<?php

namespace App\Filament\Resources\SitePageResource\Pages;

use App\Filament\Resources\SitePageResource;
use App\Models\SitePage;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListSitePages extends ListRecords
{
    protected static string $resource = SitePageResource::class;

    protected function getHeaderActions(): array
    {
        $isNavPublished = SitePage::isNavbarPublished();

        return [
            Actions\Action::make('toggle_navbar')
                ->label($isNavPublished ? 'Nav Bar: Published (Active)' : 'Nav Bar: Unpublished (Hidden)')
                ->icon($isNavPublished ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                ->color($isNavPublished ? 'success' : 'danger')
                ->tooltip($isNavPublished ? 'Click to unpublish the Nav Bar across the website' : 'Click to publish the Nav Bar across the website')
                ->requiresConfirmation()
                ->modalHeading($isNavPublished ? 'Unpublish Nav Bar?' : 'Publish Nav Bar?')
                ->modalDescription($isNavPublished
                    ? 'This will hide the entire top navigation bar on the public website.'
                    : 'This will show the top navigation bar on the public website.')
                ->action(function () use ($isNavPublished) {
                    $newState = !$isNavPublished;
                    SitePage::setNavbarPublished($newState);

                    Notification::make()
                        ->title($newState ? 'Nav Bar is now Published' : 'Nav Bar is now Unpublished')
                        ->success()
                        ->send();
                }),
            Actions\CreateAction::make()
                ->label('Add Page / Link'),
        ];
    }
}
