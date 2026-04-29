import React, { useState, useEffect } from "react";
import "../../../css/DashboardPage/components/Header.css";
import "../../../css/DashboardPage/components/Notification.css";

function Header({ activePage }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

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
    "manage-admins": "Manage Admins",
    "roles-permissions": "Roles & Permissions",
    "system-configuration": "System Configuration",
    "security-settings": "Security Settings",
    "backup-restore": "Backup / Restore",
    "full-audit-logs": "Full Audit Logs",
  };

  const roleLabels = {
    1: "Customer",
    2: "Admin",
    3: "SuperAdmin",
  };

  const title = pageTitles[activePage] || "Dashboard";
  const role = roleLabels[Number(user?.role_id)] || "User";

  const unreadCount = notifications.filter((n) => Number(n.is_read) === 0).length;

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": user?.user_id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to load notifications");
        return;
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": user?.user_id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to mark notifications as read");
        return;
      }

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: 1,
        }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  useEffect(() => {
    if (!user?.user_id) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [user?.user_id]);

  const handleToggleNotifications = async () => {
    const nextState = !showNotif;
    setShowNotif(nextState);

    if (nextState && unreadCount > 0) {
      await markAllAsRead();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{title}</h2>
        <p className="header-subtitle">
          Welcome back, {user?.username || "User"}
        </p>
      </div>

      <div className="header-right">
        <div className="header-notification">
          <button
            type="button"
            className="header-bell"
            onClick={handleToggleNotifications}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item notif-${n.type || "info"} ${
                      Number(n.is_read) === 0 ? "notif-unread" : ""
                    }`}
                  >
                    <div className="notif-message">{n.message}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="header-user">
          <div className="header-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="header-user-info">
            <h4>{user?.username || "User"}</h4>
            <p>{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;