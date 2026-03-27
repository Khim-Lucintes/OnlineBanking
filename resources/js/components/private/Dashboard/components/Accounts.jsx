import React from "react";

function Accounts({ dashboardData }) {
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);

  return (
    <main className="dashboard-main">
      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Customer Accounts</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Accounts Overview</h3>
            </div>
            <p className="section-description">
              View your real linked accounts and balances from MySQL.
            </p>
          </div>

          <div className="hero-summary-box">
            <p>Total Available Balance</p>
            <h2>₱{totalBalance.toLocaleString()}</h2>
            <span>{accounts.length} active account(s)</span>
          </div>
        </div>
      </section>

      <section className="dashboard-cards">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div className="small-card" key={account.account_id}>
              <p>{account.account_type} Account</p>
              <h3>₱{Number(account.balance).toLocaleString()}</h3>
              <span>{account.account_number}</span>
            </div>
          ))
        ) : (
          <div className="dashboard-panel">
            <p>No account records found.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Accounts;