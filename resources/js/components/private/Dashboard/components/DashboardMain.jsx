import React from "react";
import "../../../../../css/DashboardPage/components/DashboardMain.css";
import QuickAction from "./QuickAction";

function DashboardMain({ dashboardData, setActivePage }) {
  const user = dashboardData?.user || {};
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);
  const transactions = dashboardData?.recent_transactions || [];

  const primaryAccount = accounts[0] || null;

  return (
    <main className="dashboard-main banking-dashboard">
      <section className="dashboard-cards">
        <div className="balance-card">
          <p>Total Balance</p>
          <h2>₱{totalBalance.toLocaleString()}</h2>
          <span>{accounts.length} linked account(s)</span>
        </div>

        <div className="small-card">
          <p>Customer</p>
          <h3>{user.username || "Customer"}</h3>
          <span>{user.email || "-"}</span>
        </div>

        <div className="small-card">
          <p>Primary Account Type</p>
          <h3>{primaryAccount?.account_type || "N/A"}</h3>
          <span>Status: {primaryAccount?.status || "N/A"}</span>
        </div>

        <div className="small-card">
          <p>Primary Account Number</p>
          <h3>{primaryAccount?.account_number || "N/A"}</h3>
          <span>Active account</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Transactions</h3>
          </div>

          <div className="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <div className="transaction-item" key={txn.transaction_id}>
                  <div>
                    <h4>{txn.transaction_type}</h4>
                    <p>
                      {txn.description || "No description"} • {txn.transaction_date}
                    </p>
                  </div>
                  <span className={Number(txn.amount) >= 0 ? "positive" : "negative"}>
                    ₱{Number(txn.amount).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p>No transactions yet.</p>
            )}
          </div>
        </div>


        <div className="dashboard-panel premium-panel">
  <div className="panel-header">
    <h3>Quick Actions</h3>
    <span className="panel-subtitle">Banking shortcuts</span>
  </div>

  <QuickAction setActivePage={setActivePage} />

  <div className="insight-box">
    <p>Account Holder</p>
    <h4>{user.username || "Customer"}</h4>
    <span>{user.email || "No email found"}</span>
  </div>
</div>

        <div className="dashboard-panel">
  <div className="panel-header">
    <h3>Account Overview</h3>
  </div>

  <div className="account-overview-box">
    <div className="overview-row">
      <span>Primary Account</span>
      <strong>{primaryAccount?.account_number || "N/A"}</strong>
    </div>

    <div className="overview-row">
      <span>Account Type</span>
      <strong>{primaryAccount?.account_type || "N/A"}</strong>
    </div>

    <div className="overview-row">
      <span>Status</span>
      <strong>{primaryAccount?.status || "Active"}</strong>
    </div>

    <div className="overview-row">
      <span>Available Balance</span>
      <strong>₱{Number(primaryAccount?.balance || 0).toLocaleString()}</strong>
    </div>
  </div>
</div>
      </section>
    </main>
  );
}

export default DashboardMain;