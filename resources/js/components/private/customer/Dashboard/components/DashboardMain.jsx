import React from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";
import QuickAction from "./QuickAction";

import "../../../../../../css/Admin/components/AdminSummaryCards.css";

function DashboardMain({ dashboardData, setActivePage }) {
  const user = dashboardData?.user || {};
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);
  const transactions = dashboardData?.recent_transactions || [];

  const primaryAccount = accounts[0] || null;

  return (
    <main className="dashboard-main banking-dashboard">
      <section className="admin-summary-row" style={{ marginBottom: "24px" }}>
        <div className="admin-summary-box">
          <div className="admin-summary-head">
            <div className="admin-summary-title-wrap">
              <span className="admin-summary-icon">💰</span>
              <span className="admin-summary-title">Total Balance</span>
            </div>
          </div>
          <div className="admin-summary-body">
            <h3>₱{totalBalance.toLocaleString()}</h3>
            <span className="admin-summary-trend positive-trend">Active</span>
          </div>
          <p className="admin-summary-subtext">Combined account balance</p>
        </div>

        <div className="admin-summary-box">
          <div className="admin-summary-head">
            <div className="admin-summary-title-wrap">
              <span className="admin-summary-icon">🏦</span>
              <span className="admin-summary-title">Linked Accounts</span>
            </div>
          </div>
          <div className="admin-summary-body">
            <h3>{accounts.length}</h3>
            <span className="admin-summary-trend positive-trend">Verified</span>
          </div>
          <p className="admin-summary-subtext">Active accounts</p>
        </div>

        <div className="admin-summary-box">
          <div className="admin-summary-head">
            <div className="admin-summary-title-wrap">
              <span className="admin-summary-icon">⭐</span>
              <span className="admin-summary-title">Primary Account</span>
            </div>
          </div>
          <div className="admin-summary-body">
            <h3 style={{ fontSize: "16px" }}>{primaryAccount?.account_number || "N/A"}</h3>
            <span className="admin-summary-trend positive-trend">{primaryAccount?.account_type || "Savings"}</span>
          </div>
          <p className="admin-summary-subtext">Main account</p>
        </div>

        <div className="admin-summary-box">
          <div className="admin-summary-head">
            <div className="admin-summary-title-wrap">
              <span className="admin-summary-icon">⚡</span>
              <span className="admin-summary-title">Quick Status</span>
            </div>
          </div>
          <div className="admin-summary-body">
            <h3 style={{ fontSize: "16px", color: "#63f0b1" }}>System Online</h3>
            <span className="admin-summary-trend positive-trend">Secure</span>
          </div>
          <p className="admin-summary-subtext">All services are operating normally</p>
        </div>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <QuickAction setActivePage={setActivePage} />
      </section>

      <section className="dashboard-grid dashboard-grid-single">
  <div className="dashboard-panel premium-transactions-panel">
    <div className="panel-header">
      <div>
        <h3>Recent Transactions</h3>
        <span className="panel-subtitle">Latest activity</span>
      </div>

      <button
        className="panel-action-btn"
        onClick={() => setActivePage("transactions")}
      >
        View All
      </button>
    </div>

    <div className="transaction-list enhanced">
      {transactions.length > 0 ? (
        transactions.map((txn) => (
          <div className="transaction-item enhanced" key={txn.transaction_id}>
            <div className="transaction-left">
              <div
                className={`transaction-icon ${
                  Number(txn.amount) >= 0 ? "in" : "out"
                }`}
              >
                {Number(txn.amount) >= 0 ? "↓" : "↑"}
              </div>

              <div>
                <h4>{txn.transaction_type}</h4>
                <p>{txn.description || "No description"}</p>
                <span className="transaction-date">{txn.transaction_date}</span>
              </div>
            </div>

            <div className="transaction-right">
              <strong
                className={Number(txn.amount) >= 0 ? "positive" : "negative"}
              >
                ₱{Number(txn.amount).toLocaleString()}
              </strong>
              <span className="transaction-status">
                {txn.status || "Completed"}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">No transactions yet.</div>
      )}
    </div>
  </div>
</section>
    </main>
  );
}

export default DashboardMain;