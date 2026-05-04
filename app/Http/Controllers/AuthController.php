<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuthController extends Controller
{
    private const ROLE_CUSTOMER = 1;
    private const ROLE_ADMIN = 2;
    private const ROLE_SUPERADMIN = 3;

    private const STATUS_ACTIVE = 'Active';
    private const STATUS_PENDING = 'Pending';
    private const STATUS_SUSPENDED = 'Suspended';
    private const STATUS_REJECTED = 'Rejected';

    /* =====================================================
     | AUTH
     * ===================================================== */

    public function register(Request $request): JsonResponse
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
                    'message' => 'Customer role not found',
                ], 500);
            }

            $userId = DB::table('users_table')->insertGetId([
                'role_id' => $customerRole->role_id,
                'username' => trim($request->username),
                'password_hash' => Hash::make($request->password),
                'email' => trim($request->email),
                'email_verified' => 1,
                'status' => self::STATUS_PENDING,
                'created_at' => now(),
            ]);

            $accountNumber = 'MB' . date('Y') . str_pad($userId, 6, '0', STR_PAD_LEFT);

            DB::table('accounts_table')->insert([
                'user_id' => $userId,
                'account_type' => 'Savings',
                'account_number' => $accountNumber,
                'balance' => 0.00,
                'status' => self::STATUS_PENDING,
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

    public function login(Request $request): JsonResponse
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $email = trim($request->email);

    $user = DB::table('users_table')
        ->where('email', $email)
        ->orderByDesc('user_id')
        ->first();

    // ❌ USER NOT FOUND
    if (!$user) {
        DB::table('notifications_table')->insert([
            'user_id' => null,
            'type' => 'danger',
            'message' => 'Failed login attempt for email: ' . $email,
            'is_read' => 0,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'User not found',
        ], 401);
    }

    // ❌ WRONG PASSWORD
    if (!Hash::check($request->password, $user->password_hash)) {
        DB::table('notifications_table')->insert([
            'user_id' => $user->user_id,
            'type' => 'danger',
            'message' => 'Failed login attempt',
            'is_read' => 0,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    // 🚫 BLOCK NON-ACTIVE ACCOUNTS
    if ($user->status !== self::STATUS_ACTIVE) {

        // 🧾 audit log
        $this->createAuditLog(
            (int) $user->user_id,
            'Blocked Login',
            'User',
            (int) $user->user_id,
            'Blocked login because account is ' . $user->status
        );

        return response()->json([
            'message' =>
                $user->status === self::STATUS_PENDING
                    ? 'Your account is pending approval.'
                    : 'Your account has been rejected or suspended.',
        ], 403);
    }

    // ✅ SUCCESS LOGIN (ONLY HERE)
    DB::table('notifications_table')->insert([
        'user_id' => $user->user_id,
        'type' => 'success',
        'message' => 'Login successful',
        'is_read' => 0,
        'created_at' => now(),
    ]);

    // 🧾 audit log
    $roleName = $this->getRoleNameById((int) $user->role_id);

    $this->createAuditLog(
        (int) $user->user_id,
        'Login',
        'User',
        (int) $user->user_id,
        ucfirst($roleName) . ' logged into the system'
    );

    $permissions = $this->getUserPermissions((int) $user->user_id);

    return response()->json([
        'message' => 'Login successful',
        'user' => [
            'user_id' => $user->user_id,
            'role_id' => $user->role_id,
            'role_name' => $roleName,
            'username' => $user->username,
            'email' => $user->email,
            'status' => $user->status,
            'permissions' => $permissions,
        ],
    ]);
}

    /* =====================================================
     | SYSTEM CONFIGURATION
     * ===================================================== */

    public function getSystemConfig(Request $request): JsonResponse
    {
        $this->requireSuperAdminPermission($request, 'system_configuration');

        try {
            $settings = DB::table('system_settings_table')->get();

            $config = [];
            foreach ($settings as $setting) {
                $config[$setting->setting_key] = $setting->setting_value;
            }

            return response()->json([
                'config' => [
                    'dailyTransferLimit' => (int) ($config['daily_transfer_limit'] ?? 50000),
                    'maxBillPayment' => (int) ($config['max_bill_payment'] ?? 20000),
                    'minPasswordLength' => (int) ($config['min_password_length'] ?? 8),
                    'sessionTimeout' => (int) ($config['session_timeout'] ?? 15),
                    'accountApprovalRequired' => (bool) ($config['account_approval_required'] ?? 1),
                    'allowRegistration' => (bool) ($config['allow_registration'] ?? 1),
                    'enableTransfers' => (bool) ($config['enable_transfers'] ?? 1),
                    'enableBillPayments' => (bool) ($config['enable_bill_payments'] ?? 1),
                    'enableReportsModule' => (bool) ($config['enable_reports_module'] ?? 1),
                    'enableAuditLogs' => (bool) ($config['enable_audit_logs'] ?? 1),
                    'maintenanceMode' => (bool) ($config['maintenance_mode'] ?? 0),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load system configuration',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateSystemConfig(Request $request): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'system_configuration');

        $request->validate([
            'dailyTransferLimit' => 'required|integer|min:0',
            'maxBillPayment' => 'required|integer|min:0',
            'minPasswordLength' => 'required|integer|min:6|max:64',
            'sessionTimeout' => 'required|integer|min:1|max:1440',
            'accountApprovalRequired' => 'required|boolean',
            'allowRegistration' => 'required|boolean',
            'enableTransfers' => 'required|boolean',
            'enableBillPayments' => 'required|boolean',
            'enableReportsModule' => 'required|boolean',
            'enableAuditLogs' => 'required|boolean',
            'maintenanceMode' => 'required|boolean',
        ]);

        DB::beginTransaction();

        try {
            $settings = [
                'daily_transfer_limit' => (string) $request->dailyTransferLimit,
                'max_bill_payment' => (string) $request->maxBillPayment,
                'min_password_length' => (string) $request->minPasswordLength,
                'session_timeout' => (string) $request->sessionTimeout,
                'account_approval_required' => $request->accountApprovalRequired ? '1' : '0',
                'allow_registration' => $request->allowRegistration ? '1' : '0',
                'enable_transfers' => $request->enableTransfers ? '1' : '0',
                'enable_bill_payments' => $request->enableBillPayments ? '1' : '0',
                'enable_reports_module' => $request->enableReportsModule ? '1' : '0',
                'enable_audit_logs' => $request->enableAuditLogs ? '1' : '0',
                'maintenance_mode' => $request->maintenanceMode ? '1' : '0',
            ];

            foreach ($settings as $key => $value) {
                DB::table('system_settings_table')->updateOrInsert(
                    ['setting_key' => $key],
                    [
                        'setting_value' => $value,
                        'updated_at' => now(),
                    ]
                );
            }

            $this->createAuditLog(
                $superAdmin->user_id,
                'Update System Configuration',
                'System',
                null,
                'Updated system configuration settings'
            );

            DB::commit();

            return response()->json([
                'message' => 'System configuration updated successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update system configuration',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /* =====================================================
     | SECURITY SETTINGS
     * ===================================================== */

    public function getSecuritySettings(Request $request): JsonResponse
    {
        $this->requireSuperAdminPermission($request, 'security_settings');

        try {
            $settings = DB::table('security_settings_table')->get();

            $config = [];
            foreach ($settings as $setting) {
                $config[$setting->setting_key] = $setting->setting_value;
            }

            return response()->json([
                'settings' => [
                    'minPasswordLength' => (int) ($config['min_password_length'] ?? 8),
                    'requireUppercase' => (bool) ($config['require_uppercase'] ?? 1),
                    'requireNumber' => (bool) ($config['require_number'] ?? 1),
                    'requireSpecialChar' => (bool) ($config['require_special_char'] ?? 0),
                    'maxLoginAttempts' => (int) ($config['max_login_attempts'] ?? 5),
                    'lockoutDuration' => (int) ($config['lockout_duration'] ?? 15),
                    'enableTwoFactor' => (bool) ($config['enable_two_factor'] ?? 0),
                    'forcePasswordReset' => (bool) ($config['force_password_reset'] ?? 0),
                    'singleSessionOnly' => (bool) ($config['single_session_only'] ?? 0),
                    'autoLogoutMinutes' => (int) ($config['auto_logout_minutes'] ?? 15),
                    'allowRememberMe' => (bool) ($config['allow_remember_me'] ?? 1),
                    'restrictByIp' => (bool) ($config['restrict_by_ip'] ?? 0),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load security settings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateSecuritySettings(Request $request): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'security_settings');

        $request->validate([
            'minPasswordLength' => 'required|integer|min:6|max:64',
            'requireUppercase' => 'required|boolean',
            'requireNumber' => 'required|boolean',
            'requireSpecialChar' => 'required|boolean',
            'maxLoginAttempts' => 'required|integer|min:1|max:20',
            'lockoutDuration' => 'required|integer|min:1|max:1440',
            'enableTwoFactor' => 'required|boolean',
            'forcePasswordReset' => 'required|boolean',
            'singleSessionOnly' => 'required|boolean',
            'autoLogoutMinutes' => 'required|integer|min:1|max:1440',
            'allowRememberMe' => 'required|boolean',
            'restrictByIp' => 'required|boolean',
        ]);

        DB::beginTransaction();

        try {
            $settings = [
                'min_password_length' => (string) $request->minPasswordLength,
                'require_uppercase' => $request->requireUppercase ? '1' : '0',
                'require_number' => $request->requireNumber ? '1' : '0',
                'require_special_char' => $request->requireSpecialChar ? '1' : '0',
                'max_login_attempts' => (string) $request->maxLoginAttempts,
                'lockout_duration' => (string) $request->lockoutDuration,
                'enable_two_factor' => $request->enableTwoFactor ? '1' : '0',
                'force_password_reset' => $request->forcePasswordReset ? '1' : '0',
                'single_session_only' => $request->singleSessionOnly ? '1' : '0',
                'auto_logout_minutes' => (string) $request->autoLogoutMinutes,
                'allow_remember_me' => $request->allowRememberMe ? '1' : '0',
                'restrict_by_ip' => $request->restrictByIp ? '1' : '0',
            ];

            foreach ($settings as $key => $value) {
                DB::table('security_settings_table')->updateOrInsert(
                    ['setting_key' => $key],
                    [
                        'setting_value' => $value,
                        'updated_at' => now(),
                    ]
                );
            }

            $this->createAuditLog(
                $superAdmin->user_id,
                'Update Security Settings',
                'Security',
                null,
                'Updated security settings'
            );

            DB::commit();

            return response()->json([
                'message' => 'Security settings updated successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update security settings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function securityOverview()
{
    $pending = DB::table('users_table')->where('status', 'pending')->count();
    $active = DB::table('users_table')->where('status', 'active')->count();
    $rejected = DB::table('users_table')->where('status', 'rejected')->count();

    return response()->json([
        'data' => [
            ['name' => 'Pending', 'value' => $pending],
            ['name' => 'Active', 'value' => $active],
            ['name' => 'Rejected', 'value' => $rejected],
        ]
    ]);
}

public function adminCapacity()
{
    $totalAdmins = DB::table('users_table')
        ->where('role_id', 2)
        ->count();

    $activeAdmins = DB::table('users_table')
        ->where('role_id', 2)
        ->where('status', 'active')
        ->count();

    $inactiveAdmins = DB::table('users_table')
        ->where('role_id', 2)
        ->where('status', '!=', 'active')
        ->count();

    return response()->json([
        'data' => [
            ['name' => 'Total', 'value' => $totalAdmins],
            ['name' => 'Active', 'value' => $activeAdmins],
            ['name' => 'Inactive', 'value' => $inactiveAdmins],
        ]
    ]);
}

public function notifications()
{
    $logs = DB::table('audit_logs_table')
        ->orderByDesc('log_date')
        ->limit(10)
        ->get();

    return response()->json([
        'notifications' => $logs->map(function ($log) {
            return $log->description;
        })
    ]);
}

    /* =====================================================
     | ROLES & PERMISSIONS
     * ===================================================== */

    public function getRolesPermissions(Request $request): JsonResponse
    {
        $this->requireSuperAdminPermission($request, 'roles_permissions');

        try {
            $roles = DB::table('roles_table')
                ->select('role_id', 'role_name')
                ->orderBy('role_id')
                ->get();

            $permissions = DB::table('permissions_table')
                ->select('permission_id', 'permission_key', 'permission_name')
                ->orderBy('permission_id')
                ->get();

            $rolePermissions = DB::table('role_permissions_table')
                ->select('role_id', 'permission_id')
                ->get();

            $permissionMap = [];
            foreach ($rolePermissions as $rp) {
                $permissionMap[$rp->role_id][] = $rp->permission_id;
            }

            $result = $roles->map(function ($role) use ($permissions, $permissionMap) {
                $rolePermissionIds = $permissionMap[$role->role_id] ?? [];

                $mappedPermissions = [];
                foreach ($permissions as $permission) {
                    $mappedPermissions[$permission->permission_key] = in_array(
                        $permission->permission_id,
                        $rolePermissionIds,
                        true
                    );
                }

                return [
                    'role_id' => $role->role_id,
                    'role_name' => $role->role_name,
                    'permissions' => $mappedPermissions,
                ];
            });

            return response()->json([
                'roles' => $result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load roles and permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateRolesPermissions(Request $request): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'roles_permissions');

        $request->validate([
            'roles' => 'required|array',
            'roles.*.role_id' => 'required|integer',
            'roles.*.permissions' => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            $allPermissions = DB::table('permissions_table')
                ->select('permission_id', 'permission_key')
                ->get();

            foreach ($request->roles as $roleData) {
                $roleId = (int) $roleData['role_id'];
                $permissions = $roleData['permissions'];

                DB::table('role_permissions_table')
                    ->where('role_id', $roleId)
                    ->delete();

                foreach ($allPermissions as $permission) {
                    $isEnabled = $permissions[$permission->permission_key] ?? false;

                    if ($isEnabled) {
                        DB::table('role_permissions_table')->insert([
                            'role_id' => $roleId,
                            'permission_id' => $permission->permission_id,
                            'created_at' => now(),
                        ]);
                    }
                }
            }

            $this->createAuditLog(
                $superAdmin->user_id,
                'Update Roles & Permissions',
                'Role',
                null,
                'Updated role permission mappings'
            );

            DB::commit();

            return response()->json([
                'message' => 'Roles and permissions updated successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update roles and permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /* =====================================================
     | BACKUP / RESTORE
     * ===================================================== */

    public function backupDatabase(Request $request)
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'backup_restore');

        try {
            $dbHost = env('DB_HOST');
            $dbName = env('DB_DATABASE');
            $dbUser = env('DB_USERNAME');
            $dbPass = env('DB_PASSWORD');

            $fileName = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
            $filePath = storage_path("app/{$fileName}");

            $command = "mysqldump --user={$dbUser} --password={$dbPass} --host={$dbHost} {$dbName} > {$filePath}";

            exec($command, $output, $result);

            if ($result !== 0) {
                throw new \Exception('Backup failed');
            }

            $this->createAuditLog(
                $superAdmin->user_id,
                'Database Backup',
                'System',
                null,
                'Created database backup'
            );

            return response()->download($filePath)->deleteFileAfterSend(true);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Backup failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function restoreDatabase(Request $request)
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'backup_restore');

        $request->validate([
            'backup_file' => 'required|file|mimes:sql,txt',
        ]);

        try {
            $file = $request->file('backup_file');
            $filePath = $file->getRealPath();

            $dbHost = env('DB_HOST');
            $dbName = env('DB_DATABASE');
            $dbUser = env('DB_USERNAME');
            $dbPass = env('DB_PASSWORD');

            $command = "mysql --user={$dbUser} --password={$dbPass} --host={$dbHost} {$dbName} < {$filePath}";

            exec($command, $output, $result);

            if ($result !== 0) {
                throw new \Exception('Restore failed');
            }

            $this->createAuditLog(
                $superAdmin->user_id,
                'Database Restore',
                'System',
                null,
                'Restored database from backup file'
            );

            return response()->json([
                'message' => 'Database restored successfully',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Restore failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /* =====================================================
     | ROLE GUARDS
     * ===================================================== */

    private function getActingAdminId(Request $request): int
    {
        return (int) $request->header('X-Admin-User-Id', 0);
    }

    private function requireAdmin(Request $request)
    {
        $adminId = $this->getActingAdminId($request);

        $admin = DB::table('users_table')
            ->where('user_id', $adminId)
            ->first();

        if (
            !$admin ||
            !in_array((int) $admin->role_id, [self::ROLE_ADMIN, self::ROLE_SUPERADMIN], true) ||
            $admin->status !== self::STATUS_ACTIVE
        ) {
            abort(403, 'Unauthorized');
        }

        return $admin;
    }

    private function requireSuperAdmin(Request $request)
    {
        $adminId = $this->getActingAdminId($request);

        $admin = DB::table('users_table')
            ->where('user_id', $adminId)
            ->first();

        if (
            !$admin ||
            (int) $admin->role_id !== self::ROLE_SUPERADMIN ||
            $admin->status !== self::STATUS_ACTIVE
        ) {
            abort(403, 'SuperAdmin only');
        }

        return $admin;
    }

    /* =====================================================
     | SUPER ADMIN
     * ===================================================== */

    public function createAdmin(Request $request): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'manage_admins');

        $request->validate([
            'username' => 'required|string|max:100|unique:users_table,username',
            'email' => 'required|email|max:150|unique:users_table,email',
            'password' => 'required|string|min:8',
        ]);

        DB::beginTransaction();

        try {
            $adminRole = DB::table('roles_table')
                ->where('role_name', 'Admin')
                ->first();

            if (!$adminRole) {
                return response()->json([
                    'message' => 'Admin role not found',
                ], 500);
            }

            $userId = DB::table('users_table')->insertGetId([
                'role_id' => $adminRole->role_id,
                'username' => trim($request->username),
                'password_hash' => Hash::make($request->password),
                'email' => trim($request->email),
                'email_verified' => 1,
                'status' => self::STATUS_ACTIVE,
                'created_at' => now(),
            ]);

            $this->createAuditLog(
                $superAdmin->user_id,
                'Create Admin',
                'User',
                $userId,
                'Created new admin: ' . trim($request->username)
            );

            DB::table('notifications_table')->insert([
    'user_id' => $superAdmin->user_id,
    'type' => 'warning',
    'message' => 'Admin deactivated',
    'is_read' => 0,
    'created_at' => now(),
]);

DB::table('notifications_table')->insert([
    'user_id' => $superAdmin->user_id,
    'type' => 'warning',
    'message' => 'Admin deactivated',
    'is_read' => 0,
    'created_at' => now(),
]);
            

            DB::commit();

            return response()->json([
                'message' => 'Admin created successfully',
                'user_id' => $userId,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create admin',
                'error' => $e->getMessage(),
            ], 500);
        }
        
    }

    public function getSuperAdminAuditLogs(Request $request): JsonResponse
    {
        $this->requireSuperAdminPermission($request, 'full_audit_logs');

        try {
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
                $search = trim($request->search);

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
                ->orderByDesc('a.log_date')
                ->get();

            return response()->json([
                'logs' => $logs,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load super admin audit logs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function exportSuperAdminAuditLogs(Request $request): StreamedResponse
    {
        $this->requireSuperAdminPermission($request, 'full_audit_logs');

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

        // Filters
        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('a.action', 'like', "%{$search}%")
                    ->orWhere('a.target_type', 'like', "%{$search}%")
                    ->orWhere('a.description', 'like', "%{$search}%")
                    ->orWhere('a.ip_address', 'like', "%{$search}%")
                    ->orWhere('u.username', 'like', "%{$search}%")
                    ->orWhere('u.email', 'like', "%{$search}%");
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

        $filename = 'superadmin_audit_logs_' . now()->format('Y_m_d_H_i_s') . '.csv';

        return response()->streamDownload(function () use ($query) {

            // 🔥 CLEAN OUTPUT BUFFER (IMPORTANT)
            if (ob_get_level()) {
                ob_end_clean();
            }

            $file = fopen('php://output', 'w');

            // ✅ UTF-8 BOM (Fix Excel encoding issue)
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // ✅ CSV HEADER
            fputcsv($file, [
                'Log ID',
                'Username',
                'Email',
                'Action',
                'Target Type',
                'Target ID',
                'Description',
                'IP Address',
                'Log Date',
            ]);

            // ✅ CHUNK DATA (prevents memory crash)
            $query->orderByDesc('a.log_date')
                ->chunk(500, function ($logs) use ($file) {

                    foreach ($logs as $log) {
                        fputcsv($file, [
                            $log->log_id,
                            $log->username ?? 'N/A',
                            $log->email ?? 'N/A',
                            $log->action,
                            $log->target_type,
                            $log->target_id,
                            $log->description,
                            $log->ip_address,
                            $log->log_date,
                        ]);
                    }
                });

            fclose($file);

        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'no-store, no-cache',
        ]);
    }

    public function getSuperAdminOverview(Request $request)
    {
        $this->requireSuperAdminPermission($request, 'dashboard');

        try {
            $adminRole = DB::table('roles_table')
                ->where('role_name', 'Admin')
                ->first();

            $totalAdmins = 0;
            $activeAdmins = 0;

            if ($adminRole) {
                $totalAdmins = DB::table('users_table')
                    ->where('role_id', $adminRole->role_id)
                    ->count();

                $activeAdmins = DB::table('users_table')
                    ->where('role_id', $adminRole->role_id)
                    ->where('status', self::STATUS_ACTIVE)
                    ->count();
            }

            $suspendedUsers = DB::table('users_table')
                ->where('status', self::STATUS_SUSPENDED)
                ->count();

            $failedTransactions = DB::table('transactions_table')
                ->where('status', 'Failed')
                ->count();

            $pendingApprovals = DB::table('users_table')
                ->where('status', self::STATUS_PENDING)
                ->count();

            $activeAlerts = $suspendedUsers + $failedTransactions;

            $systemHealth = 'Healthy';
            if ($activeAlerts > 10) {
                $systemHealth = 'Critical';
            } elseif ($activeAlerts > 0 || $pendingApprovals > 0) {
                $systemHealth = 'Warning';
            }

            $this->createAuditLog(
                $this->getActingAdminId($request),
                'View SuperAdmin Overview',
                'Dashboard',
                null,
                'Viewed super admin overview summary'
            );

            return response()->json([
                'summary' => [
                    'total_admins' => $totalAdmins,
                    'active_admins' => $activeAdmins,
                    'active_alerts' => $activeAlerts,
                    'suspended_users' => $suspendedUsers,
                    'failed_transactions' => $failedTransactions,
                    'pending_approvals' => $pendingApprovals,
                    'system_health' => $systemHealth,
                    'system_uptime' => 'Online',
                ]
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load super admin overview',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deactivateAdmin(Request $request, int $id): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'manage_admins');

        $adminRole = DB::table('roles_table')
            ->where('role_name', 'Admin')
            ->first();

        if (!$adminRole) {
            return response()->json([
                'message' => 'Admin role not found',
            ], 500);
        }

        $admin = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', $adminRole->role_id)
            ->first();

        if (!$admin) {
            return response()->json([
                'message' => 'Admin not found',
            ], 404);
        }

        if ($admin->status === self::STATUS_SUSPENDED) {
            return response()->json([
                'message' => 'Admin is already deactivated',
            ], 400);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'status' => self::STATUS_SUSPENDED,
            ]);

        $this->createAuditLog(
            $superAdmin->user_id,
            'Deactivate Admin',
            'User',
            $id,
            'Deactivated admin account: ' . $admin->username
        );

        return response()->json([
            'message' => 'Admin deactivated successfully',
        ]);
    }

    public function activateAdmin(Request $request, int $id): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'manage_admins');

        $adminRole = DB::table('roles_table')
            ->where('role_name', 'Admin')
            ->first();

        if (!$adminRole) {
            return response()->json([
                'message' => 'Admin role not found',
            ], 500);
        }

        $admin = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', $adminRole->role_id)
            ->first();

        if (!$admin) {
            return response()->json([
                'message' => 'Admin not found',
            ], 404);
        }

        if ($admin->status === self::STATUS_ACTIVE) {
            return response()->json([
                'message' => 'Admin is already active',
            ], 400);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'status' => self::STATUS_ACTIVE,
            ]);

        $this->createAuditLog(
            $superAdmin->user_id,
            'Activate Admin',
            'User',
            $id,
            'Activated admin account: ' . $admin->username
        );

        return response()->json([
            'message' => 'Admin activated successfully',
        ]);
    }

    public function getAdmins(Request $request): JsonResponse
    {
        $this->requireSuperAdminPermission($request, 'manage_admins');

        $admins = DB::table('users_table as u')
            ->join('roles_table as r', 'u.role_id', '=', 'r.role_id')
            ->where('r.role_name', 'Admin')
            ->select(
                'u.user_id',
                'u.username',
                'u.email',
                'u.status',
                'u.created_at'
            )
            ->orderByDesc('u.user_id')
            ->get();

        return response()->json([
            'admins' => $admins,
        ]);
    }

    public function promoteToAdmin(Request $request, int $id): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'manage_admins');

        $adminRole = DB::table('roles_table')
            ->where('role_name', 'Admin')
            ->first();

        if (!$adminRole) {
            return response()->json([
                'message' => 'Admin role not found',
            ], 500);
        }

        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'role_id' => $adminRole->role_id,
            ]);

        $this->createAuditLog(
            $superAdmin->user_id,
            'Promote User',
            'User',
            $id,
            'Promoted user to admin: ' . $user->username
        );

        return response()->json([
            'message' => 'User promoted to Admin',
        ]);
    }

    public function demoteToCustomer(Request $request, int $id): JsonResponse
    {
        $superAdmin = $this->requireSuperAdminPermission($request, 'manage_admins');

        $customerRole = DB::table('roles_table')
            ->where('role_name', 'Customer')
            ->first();

        if (!$customerRole) {
            return response()->json([
                'message' => 'Customer role not found',
            ], 500);
        }

        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'role_id' => $customerRole->role_id,
            ]);

        $this->createAuditLog(
            $superAdmin->user_id,
            'Demote Admin',
            'User',
            $id,
            'Demoted admin to customer: ' . $user->username
        );

        return response()->json([
            'message' => 'Admin demoted to Customer',
        ]);
    }

public function getNotifications(Request $request): JsonResponse
{
    $user = $this->requireAuthenticatedUser($request);

    $notifications = DB::table('notifications_table')
        ->where(function ($query) use ($user) {
            $query->where('user_id', $user->user_id);

            // 🔥 SuperAdmin sees system alerts too
            if ($user->role_id == 3) {
                $query->orWhereNull('user_id');
            }
        })
        ->orderByDesc('created_at')
        ->limit(15)
        ->get([
            'notification_id as id',
            'type',
            'message',
            'is_read',
            'created_at as time',
        ]);

    return response()->json([
        'notifications' => $notifications,
    ]);
}

public function markNotificationsAsRead(Request $request): JsonResponse
{
    $user = $this->requireAuthenticatedUser($request);

    try {
        DB::table('notifications_table')
            ->where('user_id', $user->user_id)
            ->update([
                'is_read' => 1,
            ]);

        return response()->json([
            'message' => 'Notifications marked as read',
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Failed to mark notifications as read',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    /* =====================================================
     | CUSTOMER
     * ===================================================== */

    public function customer(int $id): JsonResponse
    {
        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', self::ROLE_CUSTOMER)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Customer not found',
            ], 404);
        }

        return response()->json($user);
    }

    public function dashboard(int $id): JsonResponse
    {
        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', self::ROLE_CUSTOMER)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Customer not found',
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
            ->orderByDesc('transaction_date')
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

    public function allTransactions(int $id): JsonResponse
    {
        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', self::ROLE_CUSTOMER)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Customer not found',
            ], 404);
        }

        $accountIds = DB::table('accounts_table')
            ->where('user_id', $id)
            ->pluck('account_id');

        $transactions = DB::table('transactions_table')
            ->whereIn('account_id', $accountIds)
            ->orderByDesc('transaction_date')
            ->get();

        return response()->json([
            'user' => [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'email' => $user->email,
            ],
            'transactions' => $transactions,
        ]);
    }

    public function getBills(): JsonResponse
    {
        return response()->json(DB::table('bills_table')->get());
    }

    public function getRecipient(string $accountNumber): JsonResponse
    {
        $account = DB::table('accounts_table')
            ->join('users_table', 'accounts_table.user_id', '=', 'users_table.user_id')
            ->where('accounts_table.account_number', trim($accountNumber))
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
                'message' => 'Recipient account not found',
            ], 404);
        }

        return response()->json([
            'recipient' => $account,
        ]);
    }

    public function transferMoney(Request $request): JsonResponse
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
                    'message' => 'Source account not found',
                ], 404);
            }

            if ($fromAccount->status !== self::STATUS_ACTIVE) {
                return response()->json([
                    'message' => 'Source account is not active',
                ], 400);
            }

            if ((float) $fromAccount->balance < (float) $request->amount) {
                return response()->json([
                    'message' => 'Insufficient balance',
                    'current_balance' => $fromAccount->balance,
                ], 400);
            }

            $destinationAccount = DB::table('accounts_table')
                ->where('account_number', trim($request->to_account))
                ->first();

            if (!$destinationAccount) {
                return response()->json([
                    'message' => 'Destination account not found',
                ], 404);
            }

            if ($destinationAccount->status !== self::STATUS_ACTIVE) {
                return response()->json([
                    'message' => 'Destination account is not active',
                ], 400);
            }

            if ((int) $destinationAccount->account_id === (int) $fromAccount->account_id) {
                return response()->json([
                    'message' => 'You cannot transfer to the same account',
                ], 400);
            }

            $referenceNo = $this->generateReferenceNumber('TRF', 'transfer_table');

            DB::table('accounts_table')
                ->where('account_id', $fromAccount->account_id)
                ->update([
                    'balance' => (float) $fromAccount->balance - (float) $request->amount,
                ]);

            DB::table('accounts_table')
                ->where('account_id', $destinationAccount->account_id)
                ->update([
                    'balance' => (float) $destinationAccount->balance + (float) $request->amount,
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

            $this->createAuditLog(
                (int) $fromAccount->user_id,
                'Transfer Money',
                'Transaction',
                null,
                'Transferred ₱' . number_format((float) $request->amount, 2) .
                ' from account ' . $fromAccount->account_number .
                ' to account ' . $destinationAccount->account_number
            );

            $senderUser = DB::table('users_table')
    ->where('user_id', $fromAccount->user_id)
    ->first();

$receiverUser = DB::table('users_table')
    ->where('user_id', $destinationAccount->user_id)
    ->first();

DB::table('notifications_table')->insert([
    [
        'user_id' => $fromAccount->user_id,
        'type' => 'info',
        'message' => 'You sent ₱' . number_format((float) $request->amount, 2) .
            ' to ' . ($receiverUser->username ?? $destinationAccount->account_number),
        'is_read' => 0,
        'created_at' => now(),
    ],
    [
        'user_id' => $destinationAccount->user_id,
        'type' => 'success',
        'message' => 'You received ₱' . number_format((float) $request->amount, 2) .
            ' from ' . ($senderUser->username ?? $fromAccount->account_number),
        'is_read' => 0,
        'created_at' => now(),
    ],
]);



            DB::commit();

            return response()->json([
                'message' => 'Transfer completed successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Transfer failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function payBill(Request $request): JsonResponse
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
                    'message' => 'Account not found',
                ], 404);
            }

            if ($account->status !== self::STATUS_ACTIVE) {
                return response()->json([
                    'message' => 'Account is not active',
                ], 400);
            }

            if ((float) $account->balance < (float) $request->amount) {
                return response()->json([
                    'message' => 'Insufficient balance',
                ], 400);
            }

            $bill = DB::table('bills_table')
                ->where('bill_id', $request->bill_id)
                ->first();

            if (!$bill) {
                return response()->json([
                    'message' => 'Biller not found',
                ], 404);
            }

            $referenceNo = $this->generateReferenceNumber('BILL', 'bill_payments_table');

            DB::table('accounts_table')
                ->where('account_id', $request->account_id)
                ->update([
                    'balance' => (float) $account->balance - (float) $request->amount,
                ]);

            DB::table('bill_payments_table')->insert([
                'account_id' => $request->account_id,
                'bill_id' => $request->bill_id,
                'amount' => $request->amount,
                'payment_date' => now(),
                'status' => 'Completed',
                'reference_no' => $referenceNo,
            ]);

            DB::table('transactions_table')->insert([
                'account_id' => $request->account_id,
                'transaction_type' => 'Bill Payment',
                'amount' => -1 * abs($request->amount),
                'transaction_date' => now(),
                'reference_no' => $referenceNo,
                'status' => 'Completed',
                'description' => 'Bill payment to ' . $bill->biller_name,
            ]);

            $this->createAuditLog(
                (int) $account->user_id,
                'Pay Bill',
                'Bill',
                (int) $request->bill_id,
                'Paid ₱' . number_format((float) $request->amount, 2) .
                ' to ' . $bill->biller_name
            );

            DB::table('notifications_table')->insert([
    'user_id' => $account->user_id,
    'type' => 'info',
    'message' => 'You paid ₱' . number_format((float) $request->amount, 2) .
        ' to ' . $bill->biller_name,
    'is_read' => 0,
    'created_at' => now(),
    
]);


            DB::commit();

            return response()->json([
                'message' => 'Bill payment completed successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Bill payment failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /* =====================================================
     | ADMIN
     * ===================================================== */

    public function getAllUsers(Request $request): JsonResponse
    {
        $this->requirePermission($request, 'manage_users');

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
            ->orderByDesc('u.user_id')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function updateUserStatus(Request $request, int $id): JsonResponse
    {
        $admin = $this->requirePermission($request, 'manage_users');

        $request->validate([
            'status' => 'required|string|in:Active,Suspended',
        ]);

        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'status' => $request->status,
            ]);

        $this->createAuditLog(
            $admin->user_id,
            'Update User Status',
            'User',
            $id,
            'Changed user status to ' . $request->status . ' for username ' . $user->username
        );

        return response()->json([
            'message' => 'User status updated successfully',
        ]);
    }

    public function getPendingApprovals(Request $request): JsonResponse
    {
        $this->requirePermission($request, 'account_approvals');

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
            ->where('u.role_id', self::ROLE_CUSTOMER)
            ->where('u.status', self::STATUS_PENDING)
            ->orderByDesc('u.created_at')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function approveAccount(Request $request, int $id): JsonResponse
    {
        $admin = $this->requirePermission($request, 'account_approvals');

        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', self::ROLE_CUSTOMER)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Pending user not found',
            ], 404);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'status' => self::STATUS_ACTIVE,
            ]);

        DB::table('accounts_table')
            ->where('user_id', $id)
            ->update([
                'status' => self::STATUS_ACTIVE,
            ]);

        $this->createAuditLog(
            $admin->user_id,
            'Approve Account',
            'User',
            $id,
            'Approved pending account for username ' . $user->username
        );

        return response()->json([
            'message' => 'User approved successfully',
        ]);
    }

    public function rejectAccount(Request $request, int $id): JsonResponse
    {
        $admin = $this->requirePermission($request, 'account_approvals');

        $user = DB::table('users_table')
            ->where('user_id', $id)
            ->where('role_id', self::ROLE_CUSTOMER)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Pending user not found',
            ], 404);
        }

        DB::table('users_table')
            ->where('user_id', $id)
            ->update([
                'status' => self::STATUS_REJECTED,
            ]);

        DB::table('accounts_table')
            ->where('user_id', $id)
            ->update([
                'status' => self::STATUS_REJECTED,
            ]);

        $this->createAuditLog(
            $admin->user_id,
            'Reject Account',
            'User',
            $id,
            'Rejected pending account for username ' . $user->username
        );

        return response()->json([
            'message' => 'User rejected successfully',
        ]);
    }

    public function getAdminTransactions(Request $request): JsonResponse
    {
        $admin = $this->requirePermission($request, 'transactions');

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
            ->orderByDesc('t.transaction_date')
            ->get();

        $this->createAuditLog(
            $admin->user_id,
            'View Transactions',
            'Transaction',
            null,
            'Viewed admin transactions page'
        );

        return response()->json([
            'transactions' => $transactions,
        ]);
    }

    public function getAdminReportSummary(Request $request): JsonResponse
    {
        $admin = $this->requirePermission($request, 'reports');

        $totalUsers = DB::table('users_table')->count();
        $activeUsers = DB::table('users_table')->where('status', self::STATUS_ACTIVE)->count();
        $suspendedUsers = DB::table('users_table')->where('status', self::STATUS_SUSPENDED)->count();
        $pendingUsers = DB::table('users_table')->where('status', self::STATUS_PENDING)->count();

        $totalAccounts = DB::table('accounts_table')->count();
        $totalTransactions = DB::table('transactions_table')->count();
        $completedTransactions = DB::table('transactions_table')->where('status', 'Completed')->count();
        $failedTransactions = DB::table('transactions_table')->where('status', 'Failed')->count();

        $totalBalance = DB::table('accounts_table')->sum('balance');

        $this->createAuditLog(
            $admin->user_id,
            'View Reports',
            'Report',
            null,
            'Viewed admin reports summary'
        );

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
            ],
        ]);
    }

    public function getTransactionTrends(Request $request): JsonResponse
    {
        $this->requirePermission($request, 'reports');

        $trends = DB::table('transactions_table')
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy(DB::raw('DATE(transaction_date)'))
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'trends' => $trends,
        ]);
    }

    /* =====================================================
     | AUDIT LOGS
     * ===================================================== */

    public function getAuditLogs(Request $request): JsonResponse
    {
        $this->requirePermission($request, 'full_audit_logs');

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
            ->orderByDesc('a.log_date')
            ->get();

        return response()->json([
            'logs' => $logs,
        ]);
    }

    public function exportAuditLogs(Request $request): StreamedResponse
    {
        $this->requirePermission($request, 'full_audit_logs');

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

        $logs = $query->orderByDesc('a.log_date')->get();

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
                'Log Date',
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

    /* =====================================================
     | HELPERS
     * ===================================================== */

    private function getRoleNameById(int $roleId): string
    {
        return match ($roleId) {
            self::ROLE_CUSTOMER => 'customer',
            self::ROLE_ADMIN => 'admin',
            self::ROLE_SUPERADMIN => 'superadmin',
            default => 'unknown',
        };
    }

    private function generateReferenceNumber(string $prefix, string $table, string $column = 'reference_no'): string
    {
        $datePart = now()->format('Ymd');
        $count = DB::table($table)->count() + 1;
        $sequence = str_pad((string) $count, 6, '0', STR_PAD_LEFT);

        return $prefix . '-' . $datePart . '-' . $sequence;
    }

    private function createAuditLog(
        ?int $userId,
        string $action,
        ?string $targetType = null,
        ?int $targetId = null,
        ?string $description = null,
        ?string $ipAddress = null
    ): void {
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

    private function getUserPermissions(int $userId): array
    {
        return DB::table('users_table as u')
            ->join('role_permissions_table as rp', 'u.role_id', '=', 'rp.role_id')
            ->join('permissions_table as p', 'rp.permission_id', '=', 'p.permission_id')
            ->where('u.user_id', $userId)
            ->pluck('p.permission_key')
            ->toArray();
    }

    private function userHasPermission(int $userId, string $permissionKey): bool
    {
        return DB::table('users_table as u')
            ->join('role_permissions_table as rp', 'u.role_id', '=', 'rp.role_id')
            ->join('permissions_table as p', 'rp.permission_id', '=', 'p.permission_id')
            ->where('u.user_id', $userId)
            ->where('p.permission_key', $permissionKey)
            ->exists();
    }

    private function requirePermission(Request $request, string $permissionKey)
    {
        $admin = $this->requireAdmin($request);

        if (!$this->userHasPermission((int) $admin->user_id, $permissionKey)) {
            abort(403, 'Permission denied');
        }

        return $admin;
    }

    private function requireSuperAdminPermission(Request $request, string $permissionKey)
    {
        $superAdmin = $this->requireSuperAdmin($request);

        if (!$this->userHasPermission((int) $superAdmin->user_id, $permissionKey)) {
            abort(403, 'Permission denied');
        }

        return $superAdmin;
    }

    private function requireAuthenticatedUser(Request $request)
{
    $userId = (int) $request->header('X-Admin-User-Id', 0);

    $user = DB::table('users_table')
        ->where('user_id', $userId)
        ->first();

    if (!$user || $user->status !== self::STATUS_ACTIVE) {
        abort(403, 'Unauthorized');
    }

    return $user;
}
}