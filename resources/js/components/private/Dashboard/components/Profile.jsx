import React from "react";

function Transactions({ dashboardData }) {
  const transactions = dashboardData?.recent_transactions || [];

  return (
    <main className="dashboard-main">
      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Transaction Records</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Transactions</h3>
            </div>
            <p className="section-description">
              View real transaction records from MySQL.
            </p>
          </div>

          <div className="hero-summary-box">
            <p>Total Records</p>
            <h2>{transactions.length}</h2>
            <span>Latest customer transactions</span>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Transaction History</h3>
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
            <p>No transactions found.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Transactions;