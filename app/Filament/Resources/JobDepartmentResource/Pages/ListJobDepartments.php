<?php

namespace App\Filament\Resources\JobDepartmentResource\Pages;

use App\Filament\Resources\JobDepartmentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListJobDepartments extends ListRecords
{
    protected static string $resource = JobDepartmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
