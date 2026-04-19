<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/customer/{id}', [AuthController::class, 'customer']);
Route::get('/dashboard/{id}', [AuthController::class, 'dashboard']);

Route::post('/transfer-money', [AuthController::class, 'transferMoney']);
Route::post('/pay-bill', [AuthController::class, 'payBill']);
Route::get('/bills', [AuthController::class, 'getBills']);
Route::get('/transactions/{id}', [AuthController::class, 'allTransactions']);
Route::get('/recipient/{accountNumber}', [AuthController::class, 'getRecipient']);

Route::get('/admin/users', [AuthController::class, 'getAllUsers']);
Route::post('/admin/users/{id}/status', [AuthController::class, 'updateUserStatus']);
Route::get('/admin/account-approvals', [AuthController::class, 'getPendingApprovals']);
Route::post('/admin/account-approvals/{id}', [AuthController::class, 'handleAccountApproval']);
Route::get('/admin/transactions', [AuthController::class, 'getAdminTransactions']);
Route::get('/admin/reports/summary', [AuthController::class, 'getAdminReportSummary']);
Route::get('/admin/audit-logs', [AuthController::class, 'getAuditLogs']);

Route::get('/admin/reports/trends', [AuthController::class, 'getTransactionTrends']);
Route::get('/admin/audit-logs', [AuthController::class, 'getAuditLogs']);
Route::get('/admin/audit-logs/export', [AuthController::class, 'exportAuditLogs']);