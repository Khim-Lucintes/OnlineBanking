<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Str;
class AuthController extends Controller
{
 public function register(Request $request)
{
    $request->validate([
        'username' => 'required|string|max:100|unique:users_table,username',
        'email' => 'required|email|max:150|unique:users_table,email',
        'password' => 'required|string|min:8',
    ]);

    DB::beginTransaction();

    try {
        $customerRole = DB::table('roles_table')
            ->where('role_name', 'Customer')
            ->first();

        if (!$customerRole) {
            return response()->json([
                'message' => 'Customer role not found'
            ], 500);
        }

        $userId = DB::table('users_table')->insertGetId([
            'role_id' => $customerRole->role_id,
            'username' => trim($request->username),
            'password_hash' => Hash::make($request->password),
            'email' => trim($request->email),
            'email_verified' => 1,
            'status' => 'Active',
            'created_at' => now(),
        ]);

        $accountNumber = 'MB' . date('Y') . str_pad($userId, 6, '0', STR_PAD_LEFT);

        DB::table('accounts_table')->insert([
            'user_id' => $userId,
            'account_type' => 'Savings',
            'account_number' => $accountNumber,
            'balance' => 0.00,
            'status' => 'Active',
            'created_at' => now(),
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Customer registered successfully',
            'user_id' => $userId,
            'account_number' => $accountNumber,
        ], 201);

    } catch (\Throwable $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Registration failed',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function login(Request $request)
    {
         $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $user = DB::table('users_table')
        ->where('email', $request->email)
        ->first();

    if (!$user) {
        return response()->json([
            'message' => 'Invalid email or password'
        ], 401);
    }

    if (!Hash::check($request->password, $user->password_hash)) {
        return response()->json([
            'message' => 'Invalid email or password'
        ], 401);
    }

    if ($user->status !== 'Active') {
        return response()->json([
            'message' => 'Your account is not active'
        ], 403);
    }

    // audit only for admin and superadmin
    if (in_array((int) $user->role_id, [2, 3])) {
        $this->createAuditLog(
            $user->user_id,
            'Login',
            'User',
            $user->user_id,
            'Admin user logged into the system'
        );
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => [
            'user_id' => $user->user_id,
            'role_id' => $user->role_id,
            'username' => $user->username,
            'email' => $user->email,
            'status' => $user->status,
        ]
    ]);
    }

    public function customer($id)
    {
        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', 1)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        return response()->json($user);
    }

    
  public function dashboard($id)
{
    $user = DB::table('users_table')
        ->where('user_id', $id)
        ->where('role_id', 1)
        ->first();

    if (!$user) {
        return response()->json([
            'message' => 'Customer not found'
        ], 404);
    }

    $accounts = DB::table('accounts_table')
        ->where('user_id', $id)
        ->get();

    $totalBalance = DB::table('accounts_table')
        ->where('user_id', $id)
        ->sum('balance');

    $accountIds = DB::table('accounts_table')
        ->where('user_id', $id)
        ->pluck('account_id');

    $transactions = DB::table('transactions_table')
        ->whereIn('account_id', $accountIds)
        ->orderBy('transaction_date', 'desc')
        ->limit(10)
        ->get();

    return response()->json([
        'user' => [
            'user_id' => $user->user_id,
            'username' => $user->username,
            'email' => $user->email,
            'status' => $user->status,
            'email_verified' => $user->email_verified,
            'created_at' => $user->created_at,
        ],
        'accounts' => $accounts,
        'total_balance' => $totalBalance,
        'recent_transactions' => $transactions,
    ]);
    } 


    public function getBills()
{
    $bills = DB::table('bills_table')->get();

    return response()->json($bills);
}

    public function transferMoney(Request $request)
{
    $request->validate([
        'from_account_id' => 'required|integer',
        'to_account' => 'required|string|max:30',
        'amount' => 'required|numeric|min:1',
        'remarks' => 'nullable|string|max:255',
    ]);

    DB::beginTransaction();

    try {
        $fromAccount = DB::table('accounts_table')
            ->where('account_id', $request->from_account_id)
            ->first();

        if (!$fromAccount) {
            return response()->json([
                'message' => 'Source account not found'
            ], 404);
        }

        if ($fromAccount->status !== 'Active') {
            return response()->json([
                'message' => 'Source account is not active'
            ], 400);
        }

        if ((float)$fromAccount->balance < (float)$request->amount) {
            return response()->json([
                'message' => 'Insufficient balance',
                'current_balance' => $fromAccount->balance
            ], 400);
        }

        $destinationAccount = DB::table('accounts_table')
            ->where('account_number', trim($request->to_account))
            ->first();

        if (!$destinationAccount) {
            return response()->json([
                'message' => 'Destination account not found'
            ], 404);
        }

        if ($destinationAccount->status !== 'Active') {
            return response()->json([
                'message' => 'Destination account is not active'
            ], 400);
        }

        if ((int)$destinationAccount->account_id === (int)$fromAccount->account_id) {
            return response()->json([
                'message' => 'You cannot transfer to the same account'
            ], 400);
        }

        $referenceNo = $this->generateReferenceNumber('TRF', 'transfer_table');

        DB::table('accounts_table')
            ->where('account_id', $fromAccount->account_id)
            ->update([
                'balance' => (float)$fromAccount->balance - (float)$request->amount
            ]);

        DB::table('accounts_table')
            ->where('account_id', $destinationAccount->account_id)
            ->update([
                'balance' => (float)$destinationAccount->balance + (float)$request->amount
            ]);

        DB::table('transfer_table')->insert([
            'from_account' => $fromAccount->account_id,
            'to_account' => $destinationAccount->account_number,
            'amount' => $request->amount,
            'transfer_date' => now(),
            'status' => 'Completed',
            'reference_no' => $referenceNo,
        ]);

        DB::table('transactions_table')->insert([
            'account_id' => $fromAccount->account_id,
            'transaction_type' => 'Transfer',
            'amount' => -1 * abs($request->amount),
            'transaction_date' => now(),
            'reference_no' => $referenceNo . '_OUT',
            'status' => 'Completed',
            'description' => $request->remarks ?: 'Transfer to ' . $destinationAccount->account_number,
        ]);

        DB::table('transactions_table')->insert([
            'account_id' => $destinationAccount->account_id,
            'transaction_type' => 'Transfer Received',
            'amount' => abs($request->amount),
            'transaction_date' => now(),
            'reference_no' => $referenceNo . '_IN',
            'status' => 'Completed',
            'description' => 'Transfer received from ' . $fromAccount->account_number,
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Transfer completed successfully'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Transfer failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

        public function payBill(Request $request)
{
    $request->validate([
        'account_id' => 'required|integer',
        'bill_id' => 'required|integer',
        'amount' => 'required|numeric|min:1',
    ]);

    DB::beginTransaction();

    try {
        $account = DB::table('accounts_table')
            ->where('account_id', $request->account_id)
            ->first();

        if (!$account) {
            return response()->json([
                'message' => 'Account not found'
            ], 404);
        }

        if ($account->status !== 'Active') {
            return response()->json([
                'message' => 'Account is not active'
            ], 400);
        }

        if ($account->balance < $request->amount) {
            return response()->json([
                'message' => 'Insufficient balance'
            ], 400);
        }

        $bill = DB::table('bills_table')
            ->where('bill_id', $request->bill_id)
            ->first();

        if (!$bill) {
            return response()->json([
                'message' => 'Biller not found'
            ], 404);
        }

        $referenceNo = $this->generateReferenceNumber('BILL', 'bill_payments_table');

        // Deduct balance
        DB::table('accounts_table')
            ->where('account_id', $request->account_id)
            ->update([
                'balance' => $account->balance - $request->amount
            ]);

        // Save bill payment
        DB::table('bill_payments_table')->insert([
            'account_id' => $request->account_id,
            'bill_id' => $request->bill_id,
            'amount' => $request->amount,
            'payment_date' => now(),
            'status' => 'Completed',
            'reference_no' => $referenceNo,
        ]);

        // Save transaction
        DB::table('transactions_table')->insert([
            'account_id' => $request->account_id,
            'transaction_type' => 'Bill Payment',
            'amount' => -1 * abs($request->amount),
            'transaction_date' => now(),
            'reference_no' => $referenceNo,
            'status' => 'Completed',
            'description' => 'Bill payment to ' . $bill->biller_name,
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Bill payment completed successfully'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Bill payment failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function allTransactions($id)
{
    $user = DB::table('users_table')
        ->where('user_id', $id)
        ->where('role_id', 1)
        ->first();

    if (!$user) {
        return response()->json([
            'message' => 'Customer not found'
        ], 404);
    }

    $accountIds = DB::table('accounts_table')
        ->where('user_id', $id)
        ->pluck('account_id');

    $transactions = DB::table('transactions_table')
        ->whereIn('account_id', $accountIds)
        ->orderBy('transaction_date', 'desc')
        ->get();

    return response()->json([
        'user' => [
            'user_id' => $user->user_id,
            'username' => $user->username,
            'email' => $user->email,
        ],
        'transactions' => $transactions
    ]);
}
    private function generateReferenceNumber($prefix, $table, $column = 'reference_no')
{
    $datePart = now()->format('Ymd');
    $count = DB::table($table)->count() + 1;
    $sequence = str_pad($count, 6, '0', STR_PAD_LEFT);

    return $prefix . '-' . $datePart . '-' . $sequence;
}
  
public function getRecipient($accountNumber)
{
    $account = DB::table('accounts_table')
        ->join('users_table', 'accounts_table.user_id', '=', 'users_table.user_id')
        ->where('accounts_table.account_number', $accountNumber)
        ->select(
            'accounts_table.account_id',
            'accounts_table.account_number',
            'accounts_table.account_type',
            'accounts_table.status',
            'users_table.user_id',
            'users_table.username'
        )
        ->first();

    if (!$account) {
        return response()->json([
            'message' => 'Recipient account not found'
        ], 404);
    }

    return response()->json([
        'recipient' => $account
    ]);
}

public function getAllUsers()
{
    $users = DB::table('users_table as u')
        ->leftJoin('roles_table as r', 'u.role_id', '=', 'r.role_id')
        ->select(
            'u.user_id',
            'u.username',
            'u.email',
            'u.status',
            'u.email_verified',
            'u.created_at',
            'u.role_id',
            'r.role_name'
        )
        ->orderBy('u.user_id', 'desc')
        ->get();

    return response()->json([
        'users' => $users
    ]);
}

    private function getActingAdminId(Request $request)
{
    return (int) $request->header('X-Admin-User-Id', 0);
}
public function updateUserStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|string|in:Active,Suspended'
    ]);

    $user = DB::table('users_table')
        ->where('user_id', $id)
        ->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

    DB::table('users_table')
        ->where('user_id', $id)
        ->update([
            'status' => $request->status
        ]);

    $adminUserId = $this->getActingAdminId($request);

    if ($adminUserId > 0) {
        $this->createAuditLog(
            $adminUserId,
            'Update User Status',
            'User',
            $id,
            'Changed user status to ' . $request->status . ' for username ' . $user->username
        );
    }

    return response()->json([
        'message' => 'User status updated successfully'
    ]);
}

public function getPendingApprovals()
{
    $users = DB::table('users_table as u')
        ->leftJoin('roles_table as r', 'u.role_id', '=', 'r.role_id')
        ->select(
            'u.user_id',
            'u.username',
            'u.email',
            'u.status',
            'u.email_verified',
            'u.created_at',
            'u.role_id',
            'r.role_name'
        )
        ->where('u.role_id', 1) // customer only
        ->where('u.status', 'Pending')
        ->orderBy('u.created_at', 'desc')
        ->get();

    return response()->json([
        'users' => $users
    ]);
}

public function handleAccountApproval(Request $request, $id)
{
    $request->validate([
        'action' => 'required|string|in:approve,reject'
    ]);

    $user = DB::table('users_table')
        ->where('user_id', $id)
        ->where('role_id', 1)
        ->first();

    if (!$user) {
        return response()->json([
            'message' => 'Pending user not found'
        ], 404);
    }

    $newStatus = $request->action === 'approve' ? 'Active' : 'Rejected';

    DB::table('users_table')
        ->where('user_id', $id)
        ->update([
            'status' => $newStatus
        ]);

    return response()->json([
        'message' => $request->action === 'approve'
            ? 'User approved successfully'
            : 'User rejected successfully'
    ]);
}

public function getAdminTransactions(Request $request)
{
    $query = DB::table('transactions_table as t')
        ->leftJoin('accounts_table as a', 't.account_id', '=', 'a.account_id')
        ->leftJoin('users_table as u', 'a.user_id', '=', 'u.user_id')
        ->select(
            't.transaction_id',
            't.account_id',
            't.transaction_type',
            't.amount',
            't.transaction_date',
            't.reference_no',
            't.status',
            't.description',
            'a.account_number',
            'a.account_type',
            'u.user_id',
            'u.username',
            'u.email'
        );

    if ($request->filled('type')) {
        $query->where('t.transaction_type', $request->type);
    }

    if ($request->filled('status')) {
        $query->where('t.status', $request->status);
    }

    if ($request->filled('date_from')) {
        $query->whereDate('t.transaction_date', '>=', $request->date_from);
    }

    if ($request->filled('date_to')) {
        $query->whereDate('t.transaction_date', '<=', $request->date_to);
    }

    $transactions = $query
        ->orderBy('t.transaction_date', 'desc')
        ->get();

    $adminUserId = $this->getActingAdminId($request);

    if ($adminUserId > 0) {
        $this->createAuditLog(
            $adminUserId,
            'View Transactions',
            'Transaction',
            null,
            'Viewed admin transactions page'
        );
    }

    return response()->json([
        'transactions' => $transactions
    ]);
}
public function getAdminReportSummary(Request $request)
{
    $totalUsers = DB::table('users_table')->count();
    $activeUsers = DB::table('users_table')->where('status', 'Active')->count();
    $suspendedUsers = DB::table('users_table')->where('status', 'Suspended')->count();
    $pendingUsers = DB::table('users_table')->where('status', 'Pending')->count();

    $totalAccounts = DB::table('accounts_table')->count();
    $totalTransactions = DB::table('transactions_table')->count();
    $completedTransactions = DB::table('transactions_table')->where('status', 'Completed')->count();
    $failedTransactions = DB::table('transactions_table')->where('status', 'Failed')->count();

    $totalBalance = DB::table('accounts_table')->sum('balance');

    $adminUserId = $this->getActingAdminId($request);

    if ($adminUserId > 0) {
        $this->createAuditLog(
            $adminUserId,
            'View Reports',
            'Report',
            null,
            'Viewed admin reports summary'
        );
    }

    return response()->json([
        'summary' => [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
            'suspended_users' => $suspendedUsers,
            'pending_users' => $pendingUsers,
            'total_accounts' => $totalAccounts,
            'total_transactions' => $totalTransactions,
            'completed_transactions' => $completedTransactions,
            'failed_transactions' => $failedTransactions,
            'total_balance' => $totalBalance,
        ]
    ]);
}


public function exportAuditLogs(Request $request)
{
    $query = DB::table('audit_logs_table as a')
        ->leftJoin('users_table as u', 'a.user_id', '=', 'u.user_id')
        ->select(
            'a.log_id',
            'u.username',
            'u.email',
            'a.action',
            'a.target_type',
            'a.target_id',
            'a.description',
            'a.ip_address',
            'a.log_date'
        );

    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('a.action', 'like', "%{$search}%")
              ->orWhere('a.target_type', 'like', "%{$search}%")
              ->orWhere('a.description', 'like', "%{$search}%")
              ->orWhere('a.ip_address', 'like', "%{$search}%")
              ->orWhere('u.username', 'like', "%{$search}%")
              ->orWhere('u.email', 'like', "%{$search}%")
              ->orWhere('a.log_id', 'like', "%{$search}%")
              ->orWhere('a.target_id', 'like', "%{$search}%");
        });
    }

    if ($request->filled('action')) {
        $query->where('a.action', $request->action);
    }

    if ($request->filled('date_from')) {
        $query->whereDate('a.log_date', '>=', $request->date_from);
    }

    if ($request->filled('date_to')) {
        $query->whereDate('a.log_date', '<=', $request->date_to);
    }

    $logs = $query->orderBy('a.log_date', 'desc')->get();

    $filename = 'audit_logs_' . now()->format('Y_m_d_H_i_s') . '.csv';

    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => "attachment; filename={$filename}",
    ];

    $callback = function () use ($logs) {
        $file = fopen('php://output', 'w');

        fputcsv($file, [
            'Log ID',
            'Username',
            'Email',
            'Action',
            'Target Type',
            'Target ID',
            'Description',
            'IP Address',
            'Log Date'
        ]);

        foreach ($logs as $log) {
            fputcsv($file, [
                $log->log_id,
                $log->username,
                $log->email,
                $log->action,
                $log->target_type,
                $log->target_id,
                $log->description,
                $log->ip_address,
                $log->log_date,
            ]);
        }

        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}

public function getAuditLogs(Request $request)
{
    $query = DB::table('audit_logs_table as a')
        ->leftJoin('users_table as u', 'a.user_id', '=', 'u.user_id')
        ->select(
            'a.log_id',
            'a.user_id',
            'a.action',
            'a.target_type',
            'a.target_id',
            'a.description',
            'a.log_date',
            'a.ip_address',
            'u.username',
            'u.email',
            'u.role_id'
        );

    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('a.action', 'like', "%{$search}%")
              ->orWhere('a.target_type', 'like', "%{$search}%")
              ->orWhere('a.description', 'like', "%{$search}%")
              ->orWhere('a.ip_address', 'like', "%{$search}%")
              ->orWhere('u.username', 'like', "%{$search}%")
              ->orWhere('u.email', 'like', "%{$search}%")
              ->orWhere('a.log_id', 'like', "%{$search}%")
              ->orWhere('a.target_id', 'like', "%{$search}%");
        });
    }

    if ($request->filled('action')) {
        $query->where('a.action', $request->action);
    }

    if ($request->filled('date_from')) {
        $query->whereDate('a.log_date', '>=', $request->date_from);
    }

    if ($request->filled('date_to')) {
        $query->whereDate('a.log_date', '<=', $request->date_to);
    }

    $logs = $query
        ->orderBy('a.log_date', 'desc')
        ->get();

    return response()->json([
        'logs' => $logs
    ]);
}

private function createAuditLog(
    $userId,
    $action,
    $targetType = null,
    $targetId = null,
    $description = null,
    $ipAddress = null
) {
    DB::table('audit_logs_table')->insert([
        'user_id' => $userId,
        'action' => $action,
        'target_type' => $targetType,
        'target_id' => $targetId,
        'description' => $description,
        'log_date' => now(),
        'ip_address' => $ipAddress ?? request()->ip(),
    ]);
}

        public function getTransactionTrends(Request $request)
{
    $trends = DB::table('transactions_table')
        ->select(
            DB::raw('DATE(transaction_date) as date'),
            DB::raw('COUNT(*) as total')
        )
        ->groupBy(DB::raw('DATE(transaction_date)'))
        ->orderBy('date', 'asc')
        ->get();

    return response()->json([
        'trends' => $trends
    ]);
}
}

