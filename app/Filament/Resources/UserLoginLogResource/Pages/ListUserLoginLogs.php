<?php

namespace App\Filament\Resources\UserLoginLogResource\Pages;

use App\Filament\Resources\UserLoginLogResource;
use Filament\Resources\Pages\ListRecords;

class ListUserLoginLogs extends ListRecords
{
    protected static string $resource = UserLoginLogResource::class;
}
