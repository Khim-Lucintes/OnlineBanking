import React from "react";
import "../../../../../../css/DashboardPage/components/Accounts.css";

function Accounts({ dashboardData }) {
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);
  const user = dashboardData?.user || {};

  const formatAmount = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "N/A";
    if (accountNumber.length <= 6) return accountNumber;
    return `${accountNumber.slice(0, 4)} •••• ${accountNumber.slice(-4)}`;
  };

  const getStatusClass = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "active") return "account-status active";
    if (value === "pending") return "account-status pending";
    if (value === "inactive") return "account-status inactive";

    return "account-status neutral";
  };

  const getAccountBadgeClass = (type) => {
    const value = (type || "").toLowerCase();

    if (value.includes("savings")) return "account-badge savings";
    if (value.includes("checking")) return "account-badge checking";
    if (value.includes("payroll")) return "account-badge payroll";
    return "account-badge default";
  };

  return (
    <main className="dashboard-main accounts-page">
      <section className="accounts-hero">
        <div className="accounts-hero-left">
          <span className="accounts-badge">Customer Accounts</span>
          <h2>Your Banking Portfolio</h2>
          <p>
            Review all your active accounts, balances, and account details in one
            secure place.
          </p>
        </div>

        <div className="accounts-hero-right">
          <div className="accounts-total-card">
            <span>Total Available Balance</span>
            <h1>{formatAmount(totalBalance)}</h1>
            <p>{accounts.length} linked account(s)</p>
          </div>
        </div>
      </section>

      <section className="accounts-summary-grid">
        <div className="account-highlight-card">
          <div className="account-highlight-top">
            <span>Primary Account</span>
            <span className={getStatusClass(accounts[0]?.status)}>
              {accounts[0]?.status || "Active"}
            </span>
          </div>

          <h3>{accounts[0]?.account_type || "Savings"} Account</h3>
          <p className="account-highlight-number">
            {accounts[0]?.account_number || "No account found"}
          </p>

          <div className="account-highlight-meta">
            <div>
              <label>Balance</label>
              <strong>{formatAmount(accounts[0]?.balance)}</strong>
            </div>
            <div>
              <label>Owner</label>
              <strong>{user.username || "Customer"}</strong>
            </div>
          </div>
        </div>

        <div className="accounts-stat-card">
          <span>Total Accounts</span>
          <h3>{accounts.length}</h3>
          <p>Linked banking accounts</p>
        </div>

        <div className="accounts-stat-card">
          <span>Customer</span>
          <h3>{user.username || "Customer"}</h3>
          <p>{user.email || "No email found"}</p>
        </div>

        <div className="accounts-stat-card">
          <span>Portfolio Status</span>
          <h3>Healthy</h3>
          <p>Account portfolio overview</p>
        </div>
      </section>

      <section className="accounts-grid">
        <div className="dashboard-panel accounts-list-panel">
          <div className="panel-header">
            <div>
              <h3>All Accounts</h3>
              <span className="panel-subtitle">Detailed account overview</span>
            </div>
          </div>

          <div className="accounts-list">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div className="account-row-pro" key={account.account_id}>
                  <div className="account-row-pro-left">
                    <div className="account-row-icon">
                      {(account.account_type || "A").charAt(0)}
                    </div>

                    <div className="account-row-info">
                      <div className="account-row-title-line">
                        <h4>{account.account_type} Account</h4>
                        <span className={getAccountBadgeClass(account.account_type)}>
                          {account.account_type}
                        </span>
                      </div>

                      <p>{maskAccountNumber(account.account_number)}</p>
                      <small>Full No: {account.account_number}</small>
                    </div>
                  </div>

                  <div className="account-row-pro-right">
                    <strong>{formatAmount(account.balance)}</strong>
                    <span className={getStatusClass(account.status)}>
                      {account.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="accounts-empty-state">No account records found.</p>
            )}
          </div>
        </div>

        <div className="dashboard-panel accounts-insight-panel">
          <div className="panel-header">
            <div>
              <h3>Portfolio Insights</h3>
              <span className="panel-subtitle">Quick financial overview</span>
            </div>
          </div>

          <div className="accounts-insight-list">
            <div className="accounts-insight-item">
              <span>Primary Account Number</span>
              <strong>{accounts[0]?.account_number || "N/A"}</strong>
            </div>

            <div className="accounts-insight-item">
              <span>Main Account Type</span>
              <strong>{accounts[0]?.account_type || "N/A"}</strong>
            </div>

            <div className="accounts-insight-item">
              <span>Total Portfolio Value</span>
              <strong>{formatAmount(totalBalance)}</strong>
            </div>

            <div className="accounts-insight-item">
              <span>Account Holder</span>
              <strong>{user.username || "Customer"}</strong>
            </div>
          </div>

          <div className="accounts-mini-note">
            <p>
              Keep your account information secure and regularly monitor your
              balances and account activity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Accounts;