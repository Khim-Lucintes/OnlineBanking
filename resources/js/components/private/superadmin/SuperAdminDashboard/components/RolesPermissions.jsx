import React, { useEffect, useMemo, useState } from "react";
import "../../../../../../css/SuperAdmin/components/RolesPermissions.css";

function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const requestHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-User-Id": adminUserId,
    }),
    [adminUserId]
  );

  const permissionLabels = {
    dashboard: "Dashboard",
    manage_admins: "Manage Admins",
    roles_permissions: "Roles & Permissions",
    system_configuration: "System Configuration",
    security_settings: "Security Settings",
    backup_restore: "Backup / Restore",
    full_audit_logs: "Full Audit Logs",
    manage_users: "Manage Users",
    account_approvals: "Account Approvals",
    transactions: "Transactions",
    reports: "Reports",
  };

  const fetchRolesPermissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/superadmin/roles-permissions", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load roles and permissions");
        return;
      }

      setRoles(data.roles || []);
    } catch (err) {
      console.error(err);
      setError("Server error while loading roles and permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesPermissions();
  }, []);

  const handleToggle = (roleIndex, permissionKey) => {
    setRoles((prevRoles) =>
      prevRoles.map((roleItem, index) => {
        if (index !== roleIndex) return roleItem;

        return {
          ...roleItem,
          permissions: {
            ...roleItem.permissions,
            [permissionKey]: !roleItem.permissions[permissionKey],
          },
        };
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/superadmin/roles-permissions", {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify({ roles }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || "Failed to update roles and permissions");
        }
        return;
      }

      setMessage(data.message || "Roles and permissions updated successfully");
    } catch (err) {
      console.error(err);
      setError("Server error while saving roles and permissions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="dashboard-main banking-dashboard roles-page">
        <section className="dashboard-panel">
          <div className="panel-content">
            <p>Loading roles and permissions...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main banking-dashboard roles-page">
      <section className="dashboard-panel">
        <div className="panel-header roles-header">
          <div>
            <h3>Roles & Permissions</h3>
            <span className="panel-subtitle">
              Define access levels and control feature visibility per role
            </span>
          </div>

          <button
            type="button"
            className="roles-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && <div className="roles-message">{message}</div>}
        {error && <div className="roles-error">{error}</div>}

        <div className="roles-grid">
          {roles.map((roleItem, roleIndex) => (
            <div className="roles-card" key={roleItem.role_id}>
              <div className="roles-card-header">
                <h4>{roleItem.role_name}</h4>
                <p>
                  {roleItem.role_name === "SuperAdmin" && "Full system control and access"}
                  {roleItem.role_name === "Admin" && "Operational management access"}
                  {roleItem.role_name === "Customer" && "Customer-facing account access"}
                </p>
              </div>

              <div className="roles-permission-list">
                {Object.keys(roleItem.permissions).map((permissionKey) => (
                  <div className="roles-permission-row" key={permissionKey}>
                    <span>{permissionLabels[permissionKey] || permissionKey}</span>

                    <label className="roles-switch">
                      <input
                        type="checkbox"
                        checked={roleItem.permissions[permissionKey]}
                        onChange={() => handleToggle(roleIndex, permissionKey)}
                      />
                      <span className="roles-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default RolesPermissions;