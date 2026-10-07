<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance / demo mode via the "down" command
| we will load this file so that any pre-rendered content can be shown
| instead of starting the framework, which could cause an exception.
|
*/

$maintenancePath = file_exists(__DIR__ . '/storage/framework/maintenance.php') ? __DIR__ . '/storage/framework/maintenance.php' : __DIR__ . '/../storage/framework/maintenance.php';
if (file_exists($maintenancePath)) {
    require $maintenancePath;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/
$vendorPath = file_exists(__DIR__ . '/vendor/autoload.php') ? __DIR__ . '/vendor/autoload.php' : __DIR__ . '/../vendor/autoload.php';
require $vendorPath;

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
*/
$appPath = file_exists(__DIR__ . '/bootstrap/app.php') ? __DIR__ . '/bootstrap/app.php' : __DIR__ . '/../bootstrap/app.php';
$app = require_once $appPath;

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
