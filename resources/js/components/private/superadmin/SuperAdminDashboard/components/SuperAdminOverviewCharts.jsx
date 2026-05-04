import React, { useEffect } from "react";
import "../../../../../../css/SuperAdmin/components/SuperAdminOverviewCharts.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

function SuperAdminOverviewCharts({
  loading,
  message,
  notifications = [],
  alertChartData = [],
  adminChartData = [],
  setNotifications,
  setAlertChartData,
  setAdminChartData,
}) {
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          fetch("/api/superadmin/analytics/security-overview"),
          fetch("/api/superadmin/analytics/admin-capacity"),
          fetch("/api/superadmin/notifications"),
        ]);

        const security = await res1.json();
        const admins = await res2.json();
        const notif = await res3.json();

        setAlertChartData?.(security.data || []);
        setAdminChartData?.(admins.data || []);
        setNotifications?.(notif.notifications || []);
      } catch (err) {
        console.error("Analytics load failed:", err);
      }
    };

    fetchAnalytics();
  }, [setAlertChartData, setAdminChartData, setNotifications]);

  if (loading) {
    return (
      <section className="sa-chart-grid">
        <div className="dashboard-panel">
          <div className="panel-content">
            <p>Loading analytics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (message) {
    return (
      <section className="sa-chart-grid">
        <div className="dashboard-panel">
          <div className="panel-content">
            <p className="sa-error-text">{message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>

      {/* 📊 Charts */}
      <section className="sa-chart-grid">
        {/* Pie Chart */}
        <div className="dashboard-panel sa-panel-card">
          <div className="panel-header">
            <div>
              <h3>Security Overview</h3>
              <span className="panel-subtitle">
                System alerts and pending actions
              </span>
            </div>
          </div>

          <div className="panel-content sa-chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={55}
                  label
                >
                  {alertChartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={["#6c63ff", "#19d1c3", "#3b82f6"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="dashboard-panel sa-panel-card">
          <div className="panel-header">
            <div>
              <h3>Admin Capacity</h3>
              <span className="panel-subtitle">
                Total vs active admins
              </span>
            </div>
          </div>

          <div className="panel-content sa-chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis dataKey="name" stroke="#8ea0c8" />
                <YAxis stroke="#8ea0c8" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#6c63ff"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}

export default SuperAdminOverviewCharts;