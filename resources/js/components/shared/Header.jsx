import React from "react";
import "../../../css/DashboardPage/components/Header.css";

function Header({ activePage, dashboardData }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔥 FIX: Clean page titles
  const pageTitles = {
    dashboard: "Dashboard",
    accounts: "Accounts",
    transfer: "Transfer Money",
    paybills: "Pay Bills",
    transactions: "Transactions",
    profile: "Profile",

    "manage-users": "Manage Users",
    "account-approvals": "Account Approvals",
    reports: "Reports",
    "audit-logs": "Audit Logs",
  };

  // 🔥 FIX: Role label dynamic
  const roleLabels = {
    1: "Customer",
    2: "Admin",
    3: "SuperAdmin",
  };

  const title = pageTitles[activePage] || "Dashboard";
  const role = roleLabels[Number(user?.role_id)] || "User";

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{title}</h2>
        <p className="header-subtitle">
          Welcome back, {user?.username || "User"}
        </p>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="header-user-info">
            <h4>{user?.username || "User"}</h4>
            <p>{role}</p> {/* 🔥 dynamic role */}
          </div>
        </div>

        <button
          className="header-action-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;