
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchDashboardData = async () => {
    if (!user || !user.user_id) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/${user.user_id}`, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDashboardData(data);
      } else {
        console.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const sharedProps = {
    dashboardData,
    refreshDashboard: fetchDashboardData,
  };

  const renderPage = () => {
    switch (activePage) {
      case "accounts":
        return <Accounts {...sharedProps} />;
      case "transfer":
        return <TransferMoney {...sharedProps} />;
      case "paybills":
        return <PayBills {...sharedProps} />;
      case "transactions":
        return <Transactions {...sharedProps} />;
      case "profile":
        return <Profile {...sharedProps} />;
      default:
        return <DashboardMain {...sharedProps} />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-main">
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="dashboard-content-wrapper">
        <Header activePage={activePage} dashboardData={dashboardData} />
        {renderPage()}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;