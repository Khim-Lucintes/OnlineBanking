import React from "react";

function TransferMoney() {
  return (
    <main className="dashboard-main">
      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Transfer Center</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Transfer Money</h3>
            </div>
            <p className="section-description">
              Send money between your own accounts, transfer to other users, or
              send to external banks securely.
            </p>
          </div>

          <div className="hero-summary-box">
            <p>Transfer Limit</p>
            <h2>₱100,000</h2>
            <span>Daily available limit</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>New Transfer</h3>
          </div>

          <form className="dashboard-form">
            <div className="form-group">
              <label>From Account</label>
              <select>
                <option>Savings Account - ****2451</option>
                <option>Checking Account - ****7812</option>
                <option>Payroll Account - ****9034</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transfer Type</label>
              <select>
                <option>Own Account Transfer</option>
                <option>Other MyBank User</option>
                <option>External Bank Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Recipient Account</label>
              <input type="text" placeholder="Enter recipient account number" />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="Enter amount" />
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <input type="text" placeholder="Optional note" />
            </div>

            <button type="button" className="form-action-btn">
              Confirm Transfer
            </button>
          </form>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Transfers</h3>
          </div>

          <div className="transaction-list">
            <div className="transaction-item">
              <div>
                <h4>Transfer to Maria Santos</h4>
                <p>Today, 10:45 AM</p>
              </div>
              <span className="negative">- ₱8,500</span>
            </div>

            <div className="transaction-item">
              <div>
                <h4>Own Account Transfer</h4>
                <p>Yesterday, 3:10 PM</p>
              </div>
              <span className="negative">- ₱5,000</span>
            </div>

            <div className="transaction-item">
              <div>
                <h4>External Bank Transfer</h4>
                <p>Jun 12, 9:25 AM</p>
              </div>
              <span className="negative">- ₱12,000</span>
            </div>
          </div>

          <div className="mini-note-box">
            <p>
              Transfers to external banks may take additional processing time
              depending on the receiving bank.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TransferMoney;