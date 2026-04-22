import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../../../../css/SuperAdmin/components/Sidebarlist.css";

const Sidebarlist = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "manage-admins", label: "Manage Admins", icon: "👥" },
    { key: "roles-permissions", label: "Roles & Permissions", icon: "🔑" },
    { key: "system-configuration", label: "System Configuration", icon: "⚙️" },
    { key: "security-settings", label: "Security Settings", icon: "🛡️" },
    { key: "backup-restore", label: "Backup / Restore", icon: "💾" },
    { key: "full-audit-logs", label: "Full Audit Logs", icon: "🧾" },
  ];

  return (
    <div className="dashboard-sidebar-menu">
      <nav className="dashboard-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`dashboard-menu-btn ${activePage === item.key ? "active" : ""
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