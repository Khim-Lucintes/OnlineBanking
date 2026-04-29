import React, { useState, useEffect } from "react";
import Sidebar from "../../../shared/Sidebar";
import Header from "../../../shared/Header";
import Footer from "../../../shared/Footer";
import { hasPermission } from "../../../utils/permission";


import AdminOverview from "./components/AdminOverview";
import ManageUsers from "./components/ManageUsers";
import Transactions from "./components/Transactions";
import AccountApprovals from "./components/AccountApprovals";
import Reports from "./components/Reports";
import AuditLogs from "./components/AuditLogs";


function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const allowedPages = [
    hasPermission("dashboard") && "dashboard",
    hasPermission("manage_users") && "manage-users",
    hasPermission("account_approvals") && "account-approvals",
    hasPermission("transactions") && "transactions",
    hasPermission("reports") && "reports",
    hasPermission("full_audit_logs") && "audit-logs",
  ].filter(Boolean);

  useEffect(() => {
    if (!allowedPages.includes(activePage)) {
      setActivePage(allowedPages[0] || "dashboard");
    }
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "manage-users":
        return hasPermission("manage_users") ? (
          <ManageUsers />
        ) : hasPermission("dashboard") ? (
          <AdminOverview setActivePage={setActivePage} />
        ) : null;

      case "account-approvals":
        return hasPermission("account_approvals") ? (
          <AccountApprovals />
        ) : hasPermission("dashboard") ? (
          <AdminOverview setActivePage={setActivePage} />
        ) : null;

      case "transactions":
        return hasPermission("transactions") ? (
          <Transactions />
        ) : hasPermission("dashboard") ? (
          <AdminOverview setActivePage={setActivePage} />
        ) : null;

      case "reports":
        return hasPermission("reports") ? (
          <Reports />
        ) : hasPermission("dashboard") ? (
          <AdminOverview setActivePage={setActivePage} />
        ) : null;

      case "audit-logs":
        return hasPermission("full_audit_logs") ? (
          <AuditLogs />
        ) : hasPermission("dashboard") ? (
          <AdminOverview setActivePage={setActivePage} />
        ) : null;

      case "dashboard":
      default:
        return hasPermission("dashboard") ? (
          <AdminOverview setActivePage={setActivePage} />
        ) : null;
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="dashboard-content-wrapper">
        <Header activePage={activePage} />
        {renderPage()}
        <Footer />
      </div>
    </div>
  );
}

export default AdminDashboard;