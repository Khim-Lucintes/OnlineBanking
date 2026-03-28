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
        $userId = DB::table('users_table')->insertGetId([
            'role_id' => 1,
            'username' => $request->username,
            'password_hash' => Hash::make($request->password),
            'email' => $request->email,
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
            'message' => 'Customer registered successfully'
        ], 201);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Registration failed',
            'error' => $e->getMessage()
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
            ->where('role_id', 1) // Customer only
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Customer account not found'
            ], 401);
        }

        if ($user->status !== 'Active') {
            return response()->json([
                'message' => 'Account is not active'
            ], 403);
        }

        if (!Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
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
}

