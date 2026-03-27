import React from "react";
import "../../../../../css/DashboardPage/components/Header.css";

function Header({ activePage, dashboardData }) {
  const titles = {
    dashboard: "Dashboard",
    accounts: "Accounts",
    transfer: "Transfer Money",
    paybills: "Pay Bills",
    transactions: "Transactions",
    profile: "Profile",
  };

  const username = dashboardData?.user?.username || "Customer";

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1>{titles[activePage] || "Dashboard"}</h1>
        <p>Welcome back, {username}</p>
      </div>

      <div className="dashboard-header-right">
        <input
          type="text"
          placeholder="Search..."
          className="dashboard-search"
        />
        <div className="dashboard-avatar">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default Header;