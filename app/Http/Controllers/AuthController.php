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
}

