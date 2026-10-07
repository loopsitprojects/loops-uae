<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
*/
$maintenancePath = file_exists(__DIR__ . '/storage/framework/maintenance.php') ? __DIR__ . '/storage/framework/maintenance.php' : __DIR__ . '/../storage/framework/maintenance.php';
if (file_exists($maintenancePath)) {
    require $maintenancePath;
}

$vendorPath = file_exists(__DIR__ . '/vendor/autoload.php') ? __DIR__ . '/vendor/autoload.php' : __DIR__ . '/../vendor/autoload.php';
require $vendorPath;

$appPath = file_exists(__DIR__ . '/bootstrap/app.php') ? __DIR__ . '/bootstrap/app.php' : __DIR__ . '/../bootstrap/app.php';
$app = require_once $appPath;

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
