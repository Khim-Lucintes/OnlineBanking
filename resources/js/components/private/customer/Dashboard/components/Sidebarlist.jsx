import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Sidebarlist({ activePage, setActivePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("user");
  navigate("/login");
};

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "accounts", label: "Accounts" },
    { key: "transfer", label: "Transfer Money" },
    { key: "paybills", label: "Pay Bills" },
    { key: "transactions", label: "Transactions" },
    { key: "profile", label: "Profile" },
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
            {item.label}
          </button>
        ))}

        {/* 🔴 Logout placed UNDER profile */}
        <button
          type="button"
          className="dashboard-menu-btn logout-menu"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* Optional: keep landing button below */}
      <div className="dashboard-sidebar-footer">
        <Link to="/" className="logout-btn secondary-btn">
          Back to Landing Page
        </Link>
      </div>
    </div>
  );
}

export default Sidebarlist;