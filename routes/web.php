<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['prefix' => 'motors_kpi'], function () {
    Route::get('/', function () {
        return view('app');
    });
    Route::post('/login', [UserController::class, 'login']);
    Route::group(['middleware' => 'auth'], function () {
        Route::get('/user', [UserController::class, 'get_user']);
    });
});