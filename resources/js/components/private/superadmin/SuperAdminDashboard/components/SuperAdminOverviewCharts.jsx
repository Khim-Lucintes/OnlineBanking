import React from "react";
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
    LineChart,
    Line,
} from "recharts";

function SuperAdminOverviewCharts({
    loading,
    message,
    riskData,
    notifications,
    alertChartData,
    adminChartData,
    history,
    healthChartData,
    systemHealth,
}) {
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
            <section className="sa-chart-grid">
                <div className="dashboard-panel sa-panel-card">
                    <div className="panel-header">
                        <div>
                            <h3>AI Risk Indicator</h3>
                            <span className="panel-subtitle">
                                Smart system risk estimation based on alerts and failures
                            </span>
                        </div>
                    </div>

                    <div className="panel-content">
                        <div className="sa-risk-card">
                            <div className="sa-risk-top">
                                <h4>{riskData.label}</h4>
                                <span className={`sa-risk-pill ${riskData.className}`}>
                                    Score: {riskData.score}%
                                </span>
                            </div>

                            <div className="sa-risk-bar">
                                <div
                                    className={`sa-risk-fill ${riskData.className}`}
                                    style={{ width: `${riskData.score}%` }}
                                />
                            </div>

                            <p className="sa-risk-advice">{riskData.advice}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-panel sa-panel-card">
                    <div className="panel-header">
                        <div>
                            <h3>Alert Notification Center</h3>
                            <span className="panel-subtitle">
                                Latest alert and operational notifications
                            </span>
                        </div>
                    </div>

                    <div className="panel-content">
                        <ul className="sa-alert-list">
                            {notifications.map((item, index) => (
                                <li key={index} className="sa-alert-item">
                                    <span className="sa-alert-dot" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="sa-chart-grid">
                <div className="dashboard-panel sa-panel-card">
                    <div className="panel-header">
                        <div>
                            <h3>Security Alerts Overview</h3>
                            <span className="panel-subtitle">
                                Suspended users, failed transactions, and pending approvals
                            </span>
                        </div>
                        <span className="sa-panel-badge">Overview</span>
                    </div>

                    <div className="panel-content sa-chart-box">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={alertChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={105}
                                    innerRadius={62}
                                    label
                                >
                                    <Cell fill="#6c63ff" />
                                    <Cell fill="#19d1c3" />
                                    <Cell fill="#3b82f6" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-panel sa-panel-card">
                    <div className="panel-header">
                        <div>
                            <h3>Admin Capacity</h3>
                            <span className="panel-subtitle">
                                Total admins versus active admins
                            </span>
                        </div>
                        <span className="sa-panel-badge">Capacity</span>
                    </div>

                    <div className="panel-content sa-chart-box">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={adminChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="name" stroke="#8ea0c8" />
                                <YAxis stroke="#8ea0c8" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="url(#adminBarGradient)" radius={[10, 10, 0, 0]} />
                                <defs>
                                    <linearGradient id="adminBarGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c1ff" />
                                        <stop offset="100%" stopColor="#6c63ff" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <section className="sa-chart-grid">
                <div className="dashboard-panel sa-panel-card">
                    <div className="panel-header">
                        <div>
                            <h3>Live Activity Trend</h3>
                            <span className="panel-subtitle">
                                Auto-refreshing operational trends
                            </span>
                        </div>
                        <span className="sa-panel-badge">Realtime</span>
                    </div>

                    <div className="panel-content sa-chart-box">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="time" stroke="#8ea0c8" />
                                <YAxis stroke="#8ea0c8" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="alerts"
                                    stroke="#19d1c3"
                                    strokeWidth={3}
                                    name="Alerts"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="admins"
                                    stroke="#6c63ff"
                                    strokeWidth={3}
                                    name="Active Admins"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pending"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    name="Pending"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-panel sa-panel-card">
                    <div className="panel-header">
                        <div>
                            <h3>System Health Score</h3>
                            <span className="panel-subtitle">
                                Health condition of the platform and services
                            </span>
                        </div>
                        <span className="sa-panel-badge">{systemHealth}</span>
                    </div>

                    <div className="panel-content sa-chart-box">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={healthChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="name" stroke="#8ea0c8" />
                                <YAxis domain={[0, 100]} stroke="#8ea0c8" />
                                <Tooltip />
                                <Bar
                                    dataKey="healthScore"
                                    fill={
                                        systemHealth === "Healthy"
                                            ? "#19d1c3"
                                            : systemHealth === "Warning"
                                                ? "#f59e0b"
                                                : "#ef4444"
                                    }
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