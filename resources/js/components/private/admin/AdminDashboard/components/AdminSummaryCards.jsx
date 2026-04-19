import React from "react";
import "../../../../../../css/Admin/components/AdminSummaryCards.css";

function AdminSummaryCards({
  totalUsers,
  totalAccounts,
  totalTransactions,
  totalBalance,
  completedTransactions,
}) {
  return (
    <section className="admin-summary-row">
      <div className="admin-summary-box">
        <div className="admin-summary-head">
          <div className="admin-summary-title-wrap">
            <span className="admin-summary-icon">👥</span>
            <span className="admin-summary-title">Total Users</span>
          </div>
          <button type="button" className="admin-summary-more">
            •••
          </button>
        </div>

        <div className="admin-summary-body">
          <h3>{totalUsers}</h3>
          <span className="admin-summary-trend positive-trend">Live</span>
        </div>

        <p className="admin-summary-subtext">Registered system users</p>
      </div>

      <div className="admin-summary-box">
        <div className="admin-summary-head">
          <div className="admin-summary-title-wrap">
            <span className="admin-summary-icon">🏦</span>
            <span className="admin-summary-title">Total Accounts</span>
          </div>
          <button type="button" className="admin-summary-more">
            •••
          </button>
        </div>

        <div className="admin-summary-body">
          <h3>{totalAccounts}</h3>
          <span className="admin-summary-trend positive-trend">Live</span>
        </div>

        <p className="admin-summary-subtext">Linked customer accounts</p>
      </div>

      <div className="admin-summary-box">
        <div className="admin-summary-head">
          <div className="admin-summary-title-wrap">
            <span className="admin-summary-icon">📄</span>
            <span className="admin-summary-title">Transactions</span>
          </div>
          <button type="button" className="admin-summary-more">
            •••
          </button>
        </div>

        <div className="admin-summary-body">
          <h3>{totalTransactions}</h3>
          <span className="admin-summary-trend positive-trend">
            {completedTransactions}
          </span>
        </div>

        <p className="admin-summary-subtext">Recorded transaction entries</p>
      </div>

      <div className="admin-summary-box">
        <div className="admin-summary-head">
          <div className="admin-summary-title-wrap">
            <span className="admin-summary-icon">💰</span>
            <span className="admin-summary-title">System Balance</span>
          </div>
          <button type="button" className="admin-summary-more">
            •••
          </button>
        </div>

        <div className="admin-summary-body">
          <h3>₱{totalBalance.toLocaleString()}</h3>
          <span className="admin-summary-trend positive-trend">Active</span>
        </div>

        <p className="admin-summary-subtext">Combined balances</p>
      </div>
    </section>
  );
}

export default AdminSummaryCards;