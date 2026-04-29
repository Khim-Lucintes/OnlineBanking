<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/
Route::get('/customer/{id}', [AuthController::class, 'customer']);
Route::get('/dashboard/{id}', [AuthController::class, 'dashboard']);

Route::post('/transfer-money', [AuthController::class, 'transferMoney']);
Route::post('/pay-bill', [AuthController::class, 'payBill']);
Route::get('/bills', [AuthController::class, 'getBills']);
Route::get('/transactions/{id}', [AuthController::class, 'allTransactions']);
Route::get('/recipient/{accountNumber}', [AuthController::class, 'getRecipient']);

/*Route::prefix('customer')->group(function () {
    Route::get('/{id}', [AuthController::class, 'customer']);
    Route::get('/dashboard/{id}', [AuthController::class, 'dashboard']);
    Route::get('/transactions/{id}', [AuthController::class, 'allTransactions']);
    Route::get('/recipient/{accountNumber}', [AuthController::class, 'getRecipient']);
    Route::get('/bills', [AuthController::class, 'getBills']);

    Route::post('/transfer-money', [AuthController::class, 'transferMoney']);
    Route::post('/pay-bill', [AuthController::class, 'payBill']);
});*/

/* 
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    Route::get('/users', [AuthController::class, 'getAllUsers']);
    Route::post('/users/{id}/status', [AuthController::class, 'updateUserStatus']);

     Route::prefix('account-approvals')->group(function () {
        Route::get('/', [AuthController::class, 'getPendingApprovals']);

        Route::post('/{id}/approve', [AuthController::class, 'approveAccount']);
        Route::post('/{id}/reject', [AuthController::class, 'rejectAccount']);
    });

    Route::get('/transactions', [AuthController::class, 'getAdminTransactions']);

    Route::get('/reports/summary', [AuthController::class, 'getAdminReportSummary']);
    Route::get('/reports/trends', [AuthController::class, 'getTransactionTrends']);

    Route::get('/audit-logs', [AuthController::class, 'getAuditLogs']);
    Route::get('/audit-logs/export', [AuthController::class, 'exportAuditLogs']);
});

Route::get('/notifications', [AuthController::class, 'getNotifications']);
Route::post('/notifications/read-all', [AuthController::class, 'markNotificationsAsRead']);
/*
|--------------------------------------------------------------------------
| Super Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('superadmin')->group(function () {
    Route::get('/overview', [AuthController::class, 'getSuperAdminOverview']);
    Route::post('/create-admin', [AuthController::class, 'createAdmin']);
    Route::get('/admins', [AuthController::class, 'getAdmins']);
    Route::put('/promote/{id}', [AuthController::class, 'promoteToAdmin']);
    Route::put('/demote/{id}', [AuthController::class, 'demoteToCustomer']);
    Route::get('/audit-logs', [AuthController::class, 'getSuperAdminAuditLogs']);
    Route::get('/audit-logs/export', [AuthController::class, 'exportSuperAdminAuditLogs']);

    Route::put('/admins/{id}/deactivate', [AuthController::class, 'deactivateAdmin']);
    Route::put('/admins/{id}/activate', [AuthController::class, 'activateAdmin']);

    Route::get('/system-config', [AuthController::class, 'getSystemConfig']);
    Route::put('/system-config', [AuthController::class, 'updateSystemConfig']);

    Route::get('/security-settings', [AuthController::class, 'getSecuritySettings']);
    Route::put('/security-settings', [AuthController::class, 'updateSecuritySettings']);

    Route::get('/roles-permissions', [AuthController::class, 'getRolesPermissions']);
    Route::put('/roles-permissions', [AuthController::class, 'updateRolesPermissions']);

    Route::post('/backup', [AuthController::class, 'backupDatabase']);
    Route::post('/restore', [AuthController::class, 'restoreDatabase']);

    Route::get('/superadmin/notifications', [AuthController::class, 'getNotifications']);
});