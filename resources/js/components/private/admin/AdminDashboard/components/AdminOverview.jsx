import React, { useEffect, useState } from "react";
import "../../../../../../css/Admin/DashboardMain.css";
import "../../../../../../css/Admin/components/OverviewCharts.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import AdminSummaryCards from "./AdminSummaryCards";
import OverviewCharts from "./OverviewCharts";


function AdminOverview({ setActivePage }) {
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const fetchOverviewData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [summaryRes, txRes, trendRes] = await Promise.all([
        fetch("/api/admin/reports/summary", {
          headers: {
            Accept: "application/json",
            "X-Admin-User-Id": adminUserId,
          },
        }),
        fetch("/api/admin/transactions", {
          headers: {
            Accept: "application/json",
            "X-Admin-User-Id": adminUserId,
          },
        }),
        fetch("/api/admin/reports/trends", {
          headers: {
            Accept: "application/json",
            "X-Admin-User-Id": adminUserId,
          },
        }),
      ]);

      const summaryData = await summaryRes.json();
      const txData = await txRes.json();
      const trendJson = await trendRes.json();

      if (!summaryRes.ok) {
        setMessage(summaryData.message || "Failed to load reports summary");
        return;
      }

      if (!txRes.ok) {
        setMessage(txData.message || "Failed to load transactions");
        return;
      }

      if (!trendRes.ok) {
        setMessage(trendJson.message || "Failed to load trends");
        return;
      }

      setSummary(summaryData.summary || null);
      setRecentTransactions((txData.transactions || []).slice(0, 5));
      setTrendData(
        (trendJson.trends || []).map((item) => ({
          date: item.date,
          transactions: Number(item.total || 0),
        }))
      );
    } catch (error) {
      setMessage("Server error while loading admin overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const totalUsers = Number(summary?.total_users || 0);
  const totalAccounts = Number(summary?.total_accounts || 0);
  const totalTransactions = Number(summary?.total_transactions || 0);
  const totalBalance = Number(summary?.total_balance || 0);

  const activeUsers = Number(summary?.active_users || 0);
  const suspendedUsers = Number(summary?.suspended_users || 0);
  const pendingUsers = Number(summary?.pending_users || 0);

  const completedTransactions = Number(summary?.completed_transactions || 0);
  const failedTransactions = Number(summary?.failed_transactions || 0);

  const userChartData = [
    { name: "Active", value: activeUsers },
    { name: "Suspended", value: suspendedUsers },
    { name: "Pending", value: pendingUsers },
  ];

  const transactionChartData = [
    { name: "Completed", value: completedTransactions },
    { name: "Failed", value: failedTransactions },
  ];

  return (
    <main className="dashboard-main banking-dashboard">
      <AdminSummaryCards
        totalUsers={totalUsers}
        totalAccounts={totalAccounts}
        totalTransactions={totalTransactions}
        totalBalance={totalBalance}
        completedTransactions={completedTransactions}
      />

      <OverviewCharts
        loading={loading}
        message={message}
        userChartData={userChartData}
        transactionChartData={transactionChartData}
        trendData={trendData}
        recentTransactions={recentTransactions}
        setActivePage={setActivePage}
      />
    </main>
  );
}

export default AdminOverview;