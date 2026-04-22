import React, { useState, useEffect, useMemo } from "react";
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

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <SuperAdminOverview setActivePage={setActivePage} />
        );

      case "manage-admins":
        return <ManageAdmins />;

      case "roles-permissions":
        return <RolesPermissions />;

      case "system-configuration":
        return <SystemConfiguration />;

      case "security-settings":
        return <SecuritySettings />;

      case "backup-restore":
        return <BackupRestore />;

      case "full-audit-logs":
        return <FullAuditLogs />;

      default:
        return (
          <SuperAdminOverview setActivePage={setActivePage} />
        );
    }
  };

  useEffect(() => {
    const allowedPages = [
      hasPermission("dashboard") && "dashboard",
      hasPermission("manage_admins") && "manage-admins",
      hasPermission("roles_permissions") && "roles-permissions",
      hasPermission("system_configuration") && "system-configuration",
      hasPermission("security_settings") && "security-settings",
      hasPermission("backup_restore") && "backup-restore",
      hasPermission("full_audit_logs") && "full-audit-logs",
    ].filter(Boolean);

    if (!allowedPages.includes(activePage)) {
      setActivePage(allowedPages[0] || "dashboard");
    }
  }, [activePage]);

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