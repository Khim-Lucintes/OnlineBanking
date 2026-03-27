import React from "react";

function Accounts() {
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
              View your savings, checking, and linked accounts with balances,
              masked account numbers, and account status.
            </p>
          </div>

          <div className="hero-summary-box">
            <p>Total Available Balance</p>
            <h2>₱248,920.40</h2>
            <span>3 active accounts</span>
          </div>
        </div>
      </section>

      <section className="dashboard-cards">
        <div className="balance-card gradient-card">
          <div className="account-card-top">
            <span className="account-badge savings">Savings</span>
            <span className="account-status active">Active</span>
          </div>
          <p>Primary Savings Account</p>
          <h2>₱85,700.00</h2>
          <span>Account No: **** **** 2451</span>
        </div>

        <div className="small-card">
          <div className="account-card-top">
            <span className="account-badge checking">Checking</span>
            <span className="account-status active">Active</span>
          </div>
          <p>Checking Account</p>
          <h3>₱120,500.00</h3>
          <span>Account No: **** **** 7812</span>
        </div>

        <div className="small-card">
          <div className="account-card-top">
            <span className="account-badge payroll">Payroll</span>
            <span className="account-status active">Active</span>
          </div>
          <p>Payroll Account</p>
          <h3>₱42,720.00</h3>
          <span>Account No: **** **** 9034</span>
        </div>

        <div className="small-card">
          <div className="account-card-top">
            <span className="account-badge rewards">Rewards</span>
            <span className="account-status good">Updated</span>
          </div>
          <p>Rewards Wallet</p>
          <h3>18,240 pts</h3>
          <span>Updated today</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Linked Accounts</h3>
            <button type="button" className="panel-action-btn">
              Manage
            </button>
          </div>

          <div className="summary-list">
            <div className="summary-item">
              <div>
                <span>Primary Savings</span>
                <small className="summary-subtext">**** **** 2451</small>
              </div>
              <strong>₱85,700.00</strong>
            </div>

            <div className="summary-item">
              <div>
                <span>Checking Account</span>
                <small className="summary-subtext">**** **** 7812</small>
              </div>
              <strong>₱120,500.00</strong>
            </div>

            <div className="summary-item">
              <div>
                <span>Payroll Account</span>
                <small className="summary-subtext">**** **** 9034</small>
              </div>
              <strong>₱42,720.00</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Account Summary</h3>
          </div>

          <div className="info-grid">
            <div className="info-box">
              <p>Available Balance</p>
              <h4>₱248,920.40</h4>
            </div>
            <div className="info-box">
              <p>Active Accounts</p>
              <h4>3</h4>
            </div>
            <div className="info-box">
              <p>Linked Services</p>
              <h4>5</h4>
            </div>
            <div className="info-box">
              <p>Status</p>
              <h4>Good Standing</h4>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Accounts;