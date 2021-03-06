<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\WeightController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\TargetController;
use Facade\FlareClient\Report;

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
    Route::get('/login', function () {
        return view('app');
    });
    Route::post('/login', [UserController::class, 'login']);
    Route::group(['middleware' => 'auth'], function () {
        Route::get('/designations', [DesignationController::class, 'getAllDesignations']);
        Route::post('/save_designation', [DesignationController::class, 'createDesignation']);
        Route::get('/user', [UserController::class, 'get_user']);
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/users', [UserController::class, 'get_all_users']);
        Route::post('/create_user', [UserController::class, 'create_user']);
        Route::get('/users_with_pagination/{currentPage}/{pagination}/{searchKey?}', [UserController::class, 'users_with_pagination']);
        Route::get('/criterias', [CriteriaController::class, 'get_criterias']);
        Route::post('/create_criteria', [CriteriaController::class, 'create_criteria']);
        Route::post('/assign_weights_to_designation', [WeightController::class, 'assign_weights']);
        Route::get('/get_weights/{designationId}', [WeightController::class, 'get_weights']);
        Route::get('/get_criteria/{userId?}', [UserController::class, 'get_user_criteria']);
        Route::post('/post_targets', [TargetController::class, 'post_targets']);
        Route::get('/targets/{period}', [TargetController::class, 'getTargets']);
        Route::post('/approve_targets', [TargetController::class, 'approveTargets']);
        Route::post('/post_actuals', [TargetController::class, 'postActuals']);

        Route::get('/get_submitted_criteria_details', [CriteriaController::class, 'get_submitted_criteria_details']);
        Route::get('/get_kpi/{period}', [KpiController::class, 'get_kpi']);
        Route::get('/get_kpi_by_id/{kpiId}', [KpiController::class, 'getKpiById']);
        Route::get('get_user_kpi_by_period/{userId}/{period}', [KpiController::class, 'getUserKpiByPeriod']);

        Route::get('/get_pending_targets', [TargetController::class, 'getPendingTargets']);
        Route::get('/plan_details/{planId}', [TargetController::class, 'getTargetDetails']);

        Route::get('/get_pending_kpis', [KpiController::class, 'getPendingKpi']);
        Route::post('/approve_kpi', [KpiController::class, 'approveKpi']);

        Route::get('/get_subordinates', [UserController::class, 'getSubordinates']);

        Route::get('/report/{userId}/{from}/{to}', [KpiController::class, 'report']);

        Route::post('/update_remarks', [CriteriaController::class, 'updateRemarks']);
        Route::post('/change_password', [UserController::class, 'changePassword']);

        Route::get('/export_users', [UserController::class, 'exportUsers']);
    });

    Route::get('/kpi_pdf/{planId?}', [KpiController::class, 'generateKpiPdf']);
});

Route::fallback(function () {
    return redirect("/motors_kpi/");
});
