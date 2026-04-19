import React from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";
import QuickAction from "./QuickAction";

function DashboardMain({ dashboardData, setActivePage }) {
  const user = dashboardData?.user || {};
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);
  const transactions = dashboardData?.recent_transactions || [];

  const primaryAccount = accounts[0] || null;

  return (
    <main className="dashboard-main banking-dashboard">
      <section className="dashboard-cards dashboard-cards-enhanced">
  <div className="balance-card featured-balance-card">
    <div className="featured-balance-top">
      <div>
        <p>Total Balance</p>
        <h2>₱{totalBalance.toLocaleString()}</h2>
        <span>{accounts.length} linked account(s)</span>
      </div>

      <div className="featured-balance-chip">
        {primaryAccount?.account_type || "Savings"}
      </div>
    </div>

    <div className="featured-balance-meta">
      <div className="featured-meta-box">
        <p>Primary Account</p>
        <h4>{primaryAccount?.account_number || "N/A"}</h4>
      </div>

      <div className="featured-meta-box">
        <p>Status</p>
        <h4>{primaryAccount?.status || "Active"}</h4>
      </div>
    </div>

    <div className="featured-balance-actions">
      <QuickAction setActivePage={setActivePage} />
    </div>
  </div>
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