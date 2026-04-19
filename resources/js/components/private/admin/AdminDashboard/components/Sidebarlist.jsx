import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../../../../css/Admin/components/Sidebarlist.css";

function Sidebarlist({ activePage, setActivePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "manage-users", label: "Manage Users", icon: "👥" },
    { key: "account-approvals", label: "Account Approvals", icon: "✔" },
    { key: "transactions", label: "Transactions", icon: "📄" },
    { key: "reports", label: "Reports", icon: "📊" },
    { key: "audit-logs", label: "Audit Logs", icon: "🧾" },
  ];

  return (
    <div className="dashboard-sidebar-menu">
      <nav className="dashboard-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`dashboard-menu-btn ${
              activePage === item.key ? "active" : ""
            }`}
            onClick={() => setActivePage(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </button>
        ))}

        <button
          type="button"
          className="dashboard-menu-btn logout-menu"
          onClick={handleLogout}
        >
          <span className="menu-icon">⏻</span>
          <span className="menu-text">Logout</span>
        </button>
      </nav>

      <div className="dashboard-sidebar-footer">
        <Link to="/" className="logout-btn secondary-btn">
          Back to Landing Page
        </Link>
      </div>
    </div>
  );
}

export default Sidebarlist;