import React from "react";

function Transactions() {
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
              Review your complete transaction history and filter by date, type,
              and amount for faster tracking.
            </p>
          </div>

          <div className="hero-summary-box">
            <p>This Month</p>
            <h2>42</h2>
            <span>Total recorded transactions</span>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Filter Transactions</h3>
          <button type="button" className="panel-action-btn">
            Apply Filter
          </button>
        </div>

        <div className="filter-grid">
          <div className="form-group">
            <label>Date From</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Date To</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select>
              <option>All</option>
              <option>Deposit</option>
              <option>Transfer</option>
              <option>Bill Payment</option>
              <option>Purchase</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount Range</label>
            <input type="text" placeholder="e.g. 1000 - 5000" />
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Transaction History</h3>
        </div>

        <div className="transaction-list">
          <div className="transaction-item">
            <div>
              <h4>Salary Deposit</h4>
              <p>Yesterday, 8:00 AM</p>
            </div>
            <span className="positive">+ ₱25,000</span>
          </div>

          <div className="transaction-item">
            <div>
              <h4>Transfer to Maria Santos</h4>
              <p>Today, 10:45 AM</p>
            </div>
            <span className="negative">- ₱8,500</span>
          </div>

          <div className="transaction-item">
            <div>
              <h4>Electric Bill Payment</h4>
              <p>Jun 12, 5:30 PM</p>
            </div>
            <span className="negative">- ₱2,350</span>
          </div>

          <div className="transaction-item">
            <div>
              <h4>Online Purchase</h4>
              <p>Jun 11, 2:15 PM</p>
            </div>
            <span className="negative">- ₱1,240</span>
          </div>

          <div className="transaction-item">
            <div>
              <h4>Rewards Credit</h4>
              <p>Jun 10, 6:45 PM</p>
            </div>
            <span className="positive">+ 540 pts</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Transactions;