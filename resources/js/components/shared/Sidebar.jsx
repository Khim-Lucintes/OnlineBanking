import React from "react";
import { getUser, hasPermission } from "../utils/permission";
import "../../../css/DashboardPage/components/Sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  const user = getUser();
  const roleId = Number(user?.role_id);

  const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

  const customerItems = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "accounts", label: "Accounts", icon: "🏦" },
    { key: "transfer", label: "Transfer Money", icon: "💸" },
    { key: "paybills", label: "Pay Bills", icon: "🧾" },
    { key: "transactions", label: "Transactions", icon: "📄" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];

  const adminItems = [
    hasPermission("dashboard") && { key: "dashboard", label: "Dashboard", icon: "🏠" },
    hasPermission("manage_users") && { key: "manage-users", label: "Manage Users", icon: "👥" },
    hasPermission("account_approvals") && { key: "account-approvals", label: "Account Approvals", icon: "✅" },
    hasPermission("transactions") && { key: "transactions", label: "Transactions", icon: "📄" },
    hasPermission("reports") && { key: "reports", label: "Reports", icon: "📊" },
    hasPermission("full_audit_logs") && { key: "audit-logs", label: "Audit Logs", icon: "🧾" },
  ].filter(Boolean);

  const superAdminItems = [
    hasPermission("dashboard") && { key: "dashboard", label: "Dashboard", icon: "🏠" },
    hasPermission("manage_admins") && { key: "manage-admins", label: "Manage Admins", icon: "👥" },
    hasPermission("roles_permissions") && { key: "roles-permissions", label: "Roles & Permissions", icon: "🛡️" },
    hasPermission("system_configuration") && { key: "system-configuration", label: "System Configuration", icon: "⚙️" },
    hasPermission("security_settings") && { key: "security-settings", label: "Security Settings", icon: "🔒" },
    hasPermission("backup_restore") && { key: "backup-restore", label: "Backup / Restore", icon: "💾" },
    hasPermission("full_audit_logs") && { key: "full-audit-logs", label: "Full Audit Logs", icon: "📜" },
  ].filter(Boolean);

  let menuItems = [];

  if (roleId === 1) {
    menuItems = customerItems;
  } else if (roleId === 2) {
    menuItems = adminItems;
  } else if (roleId === 3) {
    menuItems = superAdminItems;
  }

  const username = user?.username || "User";
  const roleName =
    roleId === 3 ? "Super Admin" : roleId === 2 ? "Admin" : "Customer";
  const initials = username.charAt(0).toUpperCase();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-top">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">MB</div>

          <div className="dashboard-brand-text">
            <h2>MyBank</h2>
            <span>{roleName}</span>
          </div>
        </div>

        <div className="dashboard-menu-list">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`dashboard-menu-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => setActivePage(item.key)}
            >
              <span className="dashboard-menu-icon">{item.icon}</span>
              <span className="dashboard-menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-sidebar-bottom">

  <button
    type="button"
    className="dashboard-logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
    </aside>
  );
}

export default Sidebar;