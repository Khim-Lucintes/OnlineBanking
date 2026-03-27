import React from "react";
import "../../../../../css/DashboardPage/components/DashboardMain.css";

function DashboardMain({ dashboardData }) {
  const user = dashboardData?.user || {};
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);
  const transactions = dashboardData?.recent_transactions || [];

  const primaryAccount = accounts[0] || null;

  return (
    <main className="dashboard-main">
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

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>My Card</h3>
          </div>

          <div className="dashboard-atm-card">
            <div className="atm-top">
              <span>MyBank</span>
              <span>VISA</span>
            </div>

            <div className="atm-chip"></div>

            <div className="atm-number">
              {primaryAccount?.account_number || "0000 0000 0000 0000"}
            </div>

            <div className="atm-footer">
              <div>
                <p>Card Holder</p>
                <h4>{(user.username || "CUSTOMER").toUpperCase()}</h4>
              </div>
              <div>
                <p>Status</p>
                <h4>{primaryAccount?.status || "ACTIVE"}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DashboardMain;