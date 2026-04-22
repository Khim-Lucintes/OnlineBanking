import React, { useEffect, useState, useMemo } from "react";
import SuperAdminSummaryCards from "./SuperadminSummaryCards";
import "../../../../../../css/SuperAdmin/components/SuperAdmindashboard.css";
import "../../../../../../css/SuperAdmin/SuperAdminOverview.css";
import SuperAdminOverviewCharts from "./SuperAdminOverviewCharts";

function SuperAdminOverview({ setActivePage }) {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const fetchOverview = async () => {
    try {
      const response = await fetch("/api/superadmin/overview", {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load overview");
        return;
      }

      const nextSummary = data.summary || null;
      setSummary(nextSummary);

      if (nextSummary) {
        setHistory((prev) => {
          const point = {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            alerts: Number(nextSummary.active_alerts || 0),
            admins: Number(nextSummary.active_admins || 0),
            pending: Number(nextSummary.pending_approvals || 0),
          };

          const updated = [...prev, point];
          return updated.slice(-8);
        });
      }

      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Server error while loading super admin overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();

    const interval = setInterval(() => {
      fetchOverview();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const totalAdmins = Number(summary?.total_admins || 0);
  const activeAdmins = Number(summary?.active_admins || 0);
  const activeAlerts = Number(summary?.active_alerts || 0);
  const suspendedUsers = Number(summary?.suspended_users || 0);
  const failedTransactions = Number(summary?.failed_transactions || 0);
  const pendingApprovals = Number(summary?.pending_approvals || 0);
  const systemHealth = summary?.system_health || "Healthy";
  const systemUptime = summary?.system_uptime || "Online";

  const riskData = useMemo(() => {
    let score = 0;
    score += activeAlerts * 20;
    score += failedTransactions * 10;
    score += suspendedUsers * 8;
    score += pendingApprovals * 4;

    if (score >= 80) {
      return {
        score: Math.min(score, 100),
        label: "Critical Risk",
        className: "risk-critical",
        advice: "Immediate admin review is recommended.",
      };
    }

    if (score >= 40) {
      return {
        score: Math.min(score, 100),
        label: "Moderate Risk",
        className: "risk-warning",
        advice: "Monitor alerts and investigate unusual activity.",
      };
    }

    return {
      score: Math.min(score, 100),
      label: "Low Risk",
      className: "risk-safe",
      advice: "System is stable with manageable activity.",
    };
  }, [activeAlerts, failedTransactions, suspendedUsers, pendingApprovals]);

  const alertChartData = [
    { name: "Suspended", value: suspendedUsers },
    { name: "Failed TX", value: failedTransactions },
    { name: "Pending", value: pendingApprovals },
  ];

  const adminChartData = [
    { name: "Total Admins", value: totalAdmins },
    { name: "Active Admins", value: activeAdmins },
  ];

  const healthChartData = [
    {
      name: "System",
      healthScore:
        systemHealth === "Healthy"
          ? 100
          : systemHealth === "Warning"
            ? 65
            : 30,
    },
  ];

  const notifications = [
    activeAlerts > 0
      ? `${activeAlerts} active alert(s) require review.`
      : "No active alerts detected.",
    failedTransactions > 0
      ? `${failedTransactions} failed transaction(s) recorded.`
      : "No failed transactions recorded.",
    pendingApprovals > 0
      ? `${pendingApprovals} pending approval request(s) waiting.`
      : "No pending approvals at the moment.",
    systemHealth === "Healthy"
      ? "System health is stable."
      : `System health is currently ${systemHealth}.`,
  ];

  return (
    <main className="dashboard-main banking-dashboard superadmin-overview-page">
      <SuperAdminSummaryCards
        totalAdmins={totalAdmins}
        activeAdmins={activeAdmins}
        activeAlerts={activeAlerts}
        systemHealth={systemHealth}
        systemUptime={systemUptime}
        onManageAdmins={() => setActivePage("manage-admins")}
      />

      <SuperAdminOverviewCharts
        loading={loading}
        message={message}
        riskData={riskData}
        notifications={notifications}
        alertChartData={alertChartData}
        adminChartData={adminChartData}
        history={history}
        healthChartData={healthChartData}
        systemHealth={systemHealth}
      />
    </main>
  );
}

export default SuperAdminOverview;