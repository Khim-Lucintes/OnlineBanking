import React, { useState, useEffect } from "react";
import Sidebar from "../../../shared/Sidebar";
import Header from "../../../shared/Header";
import Footer from "../../../shared/Footer";
import { hasPermission } from "../../../utils/permission";

import SuperAdminOverview from "./components/SuperAdminOverview";
import ManageAdmins from "./components/ManageAdmin";
import RolesPermissions from "./components/RolesPermissions";
import SystemConfiguration from "./components/SystemConfiguration";
import SecuritySettings from "./components/SecuritySettings";
import BackupRestore from "./components/BackupRestore";
import FullAuditLogs from "./components/FullAuditLogs";

function SuperAdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const allowedPages = [
    hasPermission("dashboard") && "dashboard",
    hasPermission("manage_admins") && "manage-admins",
    hasPermission("roles_permissions") && "roles-permissions",
    hasPermission("system_configuration") && "system-configuration",
    hasPermission("security_settings") && "security-settings",
    hasPermission("backup_restore") && "backup-restore",
    hasPermission("full_audit_logs") && "full-audit-logs",
  ].filter(Boolean);

  useEffect(() => {
    if (!allowedPages.includes(activePage)) {
      setActivePage(allowedPages[0] || "dashboard");
    }
  }, [activePage]);

  const renderContent = () => {
    switch (activePage) {
      case "manage-admins":
        return hasPermission("manage_admins") ? (
          <ManageAdmins />
        ) : hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;

      case "roles-permissions":
        return hasPermission("roles_permissions") ? (
          <RolesPermissions />
        ) : hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;

      case "system-configuration":
        return hasPermission("system_configuration") ? (
          <SystemConfiguration />
        ) : hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;

      case "security-settings":
        return hasPermission("security_settings") ? (
          <SecuritySettings />
        ) : hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;

      case "backup-restore":
        return hasPermission("backup_restore") ? (
          <BackupRestore />
        ) : hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;

      case "full-audit-logs":
        return hasPermission("full_audit_logs") ? (
          <FullAuditLogs />
        ) : hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;

      case "dashboard":
      default:
        return hasPermission("dashboard") ? (
          <SuperAdminOverview setActivePage={setActivePage} />
        ) : null;
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="dashboard-content-wrapper">
        <Header activePage={activePage} />
        {renderContent()}
        <Footer />
      </div>
    </div>
  );
}

export default SuperAdminDashboard;