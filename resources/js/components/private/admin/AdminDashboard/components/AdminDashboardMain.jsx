import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AdminDashboardMain from "./components/AdminDashboardMain";
import ManageCustomers from "./components/ManageCustomers";
import Transactions from "./components/Transactions";
import Billers from "./components/Billers";
import Reports from "./components/Reports";
import AuditLogs from "./components/AuditLogs";
import Profile from "./components/Profile";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "customers":
        return <ManageCustomers />;
      case "transactions":
        return <Transactions />;
      case "billers":
        return <Billers />;
      case "reports":
        return <Reports />;
      case "audit":
        return <AuditLogs />;
      case "profile":
        return <Profile />;
      default:
        return <AdminDashboardMain />;
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="dashboard-content-wrapper">
        <Header activePage={activePage} />
        {renderPage()}
      </div>
    </div>
  );
}

export default AdminDashboard;