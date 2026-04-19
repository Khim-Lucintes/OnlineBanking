import React from "react";
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

function OverviewCharts({
  loading,
  message,
  userChartData,
  transactionChartData,
  trendData,
  recentTransactions,
  setActivePage,
}) {
  const pieColors = ["#6C63FF", "#00D1FF", "#FF6B9E"];
  const barColors = ["#00D1FF", "#FF6B9E"];

  return (
    <>
      <section className="dashboard-grid admin-overview-grid">
        <div className="dashboard-panel admin-chart-panel glass-panel">
          <div className="chart-panel-header">
            <div>
              <span className="chart-kicker">Overview</span>
              <h3>User Distribution</h3>
              <p>Live breakdown of active, suspended, and pending users</p>
            </div>
            <div className="chart-badge">Realtime</div>
          </div>

          {loading ? (
            <div className="empty-state">Loading user distribution...</div>
          ) : message ? (
            <div className="empty-state">{message}</div>
          ) : (
            <div className="chart-shell">
              <div className="chart-shell-inner">
                <ResponsiveContainer width="100%" height={290}>
                  <PieChart>
                    <defs>
                      <linearGradient id="pieA" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7C5CFF" />
                        <stop offset="100%" stopColor="#5B8CFF" />
                      </linearGradient>
                      <linearGradient id="pieB" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00D1FF" />
                        <stop offset="100%" stopColor="#00E7B8" />
                      </linearGradient>
                      <linearGradient id="pieC" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FF5FA2" />
                        <stop offset="100%" stopColor="#FF8A5B" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={userChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={108}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth={2}
                    >
                      <Cell fill="url(#pieA)" />
                      <Cell fill="url(#pieB)" />
                      <Cell fill="url(#pieC)" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f1735",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-legend-grid">
                {userChartData.map((item, index) => (
                  <div className="legend-card" key={item.name}>
                    <div className="legend-left">
                      <span
                        className="legend-dot"
                        style={{ background: pieColors[index] }}
                      ></span>
                      <span>{item.name}</span>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-panel admin-chart-panel glass-panel">
          <div className="chart-panel-header">
            <div>
              <span className="chart-kicker">Performance</span>
              <h3>Transaction Performance</h3>
              <p>Completed versus failed transaction totals</p>
            </div>
            <div className="chart-badge alt">Health</div>
          </div>

          {loading ? (
            <div className="empty-state">Loading transaction performance...</div>
          ) : message ? (
            <div className="empty-state">{message}</div>
          ) : (
            <>
              <div className="chart-shell">
                <ResponsiveContainer width="100%" height={290}>
                  <BarChart data={transactionChartData} barCategoryGap={28}>
                    <defs>
                      <linearGradient id="barA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00D1FF" />
                        <stop offset="100%" stopColor="#6C63FF" />
                      </linearGradient>
                      <linearGradient id="barB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF5FA2" />
                        <stop offset="100%" stopColor="#FF8A5B" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="rgba(255,255,255,0.06)"
                    />
                    <XAxis dataKey="name" stroke="#90a0c0" tickLine={false} axisLine={false} />
                    <YAxis stroke="#90a0c0" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#0f1735",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" radius={[14, 14, 0, 0]}>
                      <Cell fill="url(#barA)" />
                      <Cell fill="url(#barB)" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="metric-mini-row">
                {transactionChartData.map((item, index) => (
                  <div className="metric-mini-card" key={item.name}>
                    <span>{item.name}</span>
                    <strong style={{ color: barColors[index] }}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-single">
        <div className="dashboard-panel admin-chart-panel glass-panel">
          <div className="chart-panel-header">
            <div>
              <span className="chart-kicker">Trend</span>
              <h3>Transaction Trends</h3>
              <p>Daily transaction activity across the system</p>
            </div>
            <div className="chart-badge">7D</div>
          </div>

          {loading ? (
            <div className="empty-state">Loading transaction trends...</div>
          ) : message ? (
            <div className="empty-state">{message}</div>
          ) : trendData.length === 0 ? (
            <div className="empty-state">No trend data found.</div>
          ) : (
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7C5CFF" />
                      <stop offset="100%" stopColor="#00D1FF" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis dataKey="date" stroke="#90a0c0" tickLine={false} axisLine={false} />
                  <YAxis stroke="#90a0c0" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f1735",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="url(#lineStroke)"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, fill: "#00D1FF" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-single">
        <div className="dashboard-panel admin-chart-panel glass-panel">
          <div className="chart-panel-header">
            <div>
              <span className="chart-kicker">Activity</span>
              <h3>Recent Transactions</h3>
              <p>Latest system-wide financial activity</p>
            </div>

            <button
              className="chart-link-btn"
              type="button"
              onClick={() => setActivePage("transactions")}
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Loading recent transactions...</div>
          ) : message ? (
            <div className="empty-state">{message}</div>
          ) : recentTransactions.length === 0 ? (
            <div className="empty-state">No transactions found.</div>
          ) : (
            <div className="recent-activity-list">
              {recentTransactions.map((txn) => (
                <div className="recent-activity-item" key={txn.transaction_id}>
                  <div className="recent-activity-left">
                    <div
                      className={`recent-activity-icon ${
                        txn.status === "Completed" ? "success" : "danger"
                      }`}
                    >
                      {txn.status === "Completed" ? "✓" : "!"}
                    </div>

                    <div className="recent-activity-meta">
                      <h4>{txn.transaction_type}</h4>
                      <p>
                        {txn.username || "Unknown User"} •{" "}
                        {txn.account_number || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="recent-activity-right">
                    <strong
                      className={Number(txn.amount) >= 0 ? "positive" : "negative"}
                    >
                      ₱{Number(txn.amount).toLocaleString()}
                    </strong>
                    <span>{txn.transaction_date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default OverviewCharts;