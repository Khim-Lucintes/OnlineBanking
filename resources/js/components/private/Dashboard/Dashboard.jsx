import React, { useState } from "react";
import "../../../../css/DashboardPage/Dashboard.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardMain from "./components/DashboardMain";
import Accounts from "./components/Accounts";
import TransferMoney from "./components/TransferMoney";
import PayBills from "./components/PayBills";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import Footer from "./components/Footer";

function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "accounts":
        return <Accounts />;
      case "transfer":
        return <TransferMoney />;
      case "paybills":
        return <PayBills />;
      case "transactions":
        return <Transactions />;
      case "profile":
        return <Profile />;
      case "dashboard":
      default:
        return <DashboardMain />;
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

export default Dashboard;