import React from "react";

function ReportSummaryCards({ summary }) {
  return (
    <section className="reports-summary-grid">
      <div className="reports-summary-card">
        <div className="reports-summary-top">
          <div className="reports-summary-icon">👥</div>
          <span className="reports-summary-badge">Users</span>
        </div>
        <p>Total Users</p>
        <h3>{summary?.total_users ?? 0}</h3>
        <span>All registered users</span>
      </div>

      <div className="reports-summary-card">
        <div className="reports-summary-top">
          <div className="reports-summary-icon">✅</div>
          <span className="reports-summary-badge success">Active</span>
        </div>
        <p>Active Users</p>
        <h3>{summary?.active_users ?? 0}</h3>
        <span>Currently active accounts</span>
      </div>

      <div className="reports-summary-card">
        <div className="reports-summary-top">
          <div className="reports-summary-icon">⛔</div>
          <span className="reports-summary-badge danger">Suspended</span>
        </div>
        <p>Suspended Users</p>
        <h3>{summary?.suspended_users ?? 0}</h3>
        <span>Restricted access accounts</span>
      </div>

      <div className="reports-summary-card">
        <div className="reports-summary-top">
          <div className="reports-summary-icon">⏳</div>
          <span className="reports-summary-badge info">Pending</span>
        </div>
        <p>Pending Users</p>
        <h3>{summary?.pending_users ?? 0}</h3>
        <span>Awaiting review</span>
      </div>
    </section>
  );
}

export default ReportSummaryCards;