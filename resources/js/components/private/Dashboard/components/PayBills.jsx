import React from "react";

function PayBills() {
  return (
    <main className="dashboard-main">
      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Bills Payment</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Pay Bills</h3>
            </div>
            <p className="section-description">
              Pay utilities, internet, credit cards, and enrolled billers. You
              can also review recent and scheduled bill payments.
            </p>
          </div>

          <div className="hero-summary-box">
            <p>Due This Week</p>
            <h2>₱10,749</h2>
            <span>3 upcoming billers</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>New Bill Payment</h3>
          </div>

          <form className="dashboard-form">
            <div className="form-group">
              <label>From Account</label>
              <select>
                <option>Savings Account - ****2451</option>
                <option>Checking Account - ****7812</option>
              </select>
            </div>

            <div className="form-group">
              <label>Biller</label>
              <select>
                <option>Electric Utility</option>
                <option>Water Utility</option>
                <option>Internet Provider</option>
                <option>Credit Card</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reference Number</label>
              <input type="text" placeholder="Enter bill/reference number" />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="Enter payment amount" />
            </div>

            <div className="form-group">
              <label>Schedule</label>
              <input type="date" />
            </div>

            <button type="button" className="form-action-btn">
              Confirm Payment
            </button>
          </form>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Bill Payments</h3>
          </div>

          <div className="transaction-list">
            <div className="transaction-item">
              <div>
                <h4>Electric Bill</h4>
                <p>Jun 12, 5:30 PM</p>
              </div>
              <span className="negative">- ₱2,350</span>
            </div>

            <div className="transaction-item">
              <div>
                <h4>Internet Bill</h4>
                <p>Jun 10, 11:20 AM</p>
              </div>
              <span className="negative">- ₱1,899</span>
            </div>

            <div className="transaction-item">
              <div>
                <h4>Credit Card Payment</h4>
                <p>Jun 08, 2:05 PM</p>
              </div>
              <span className="negative">- ₱6,500</span>
            </div>
          </div>

          <div className="mini-note-box">
            <p>
              Scheduled payments will be processed automatically on the selected
              date if sufficient balance is available.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PayBills;