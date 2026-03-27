import React from "react";
import "../../../../../css/DashboardPage/components/DashboardMain.css";

function DashboardMain() {
  return (
    <main className="dashboard-main">
      <section className="dashboard-cards">
        <div className="balance-card">
          <p>Total Balance</p>
          <h2>₱248,920.40</h2>
          <span>+2.4% this month</span>
        </div>

        <div className="small-card">
          <p>Income</p>
          <h3>₱52,000</h3>
          <span>Updated today</span>
        </div>

        <div className="small-card">
          <p>Expenses</p>
          <h3>₱19,350</h3>
          <span>This month</span>
        </div>

        <div className="small-card">
          <p>Savings</p>
          <h3>₱85,700</h3>
          <span>Goal progress 78%</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Transactions</h3>
            <a href="#">View All</a>
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
                <h4>Salary Deposit</h4>
                <p>Yesterday, 8:00 AM</p>
              </div>
              <span className="positive">+ ₱25,000</span>
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
              1234 5678 9012 3456
            </div>

            <div className="atm-footer">
              <div>
                <p>Card Holder</p>
                <h4>KHIM LUCINTES</h4>
              </div>
              <div>
                <p>Expires</p>
                <h4>12/30</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Quick Actions</h3>
          </div>

          <div className="quick-actions">
            <button>Send Money</button>
            <button>Pay Bills</button>
            <button>Transfer Funds</button>
            <button>View Statement</button>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Account Summary</h3>
          </div>

          <div className="summary-list">
            <div className="summary-item">
              <span>Checking Account</span>
              <strong>₱120,500</strong>
            </div>
            <div className="summary-item">
              <span>Savings Account</span>
              <strong>₱85,700</strong>
            </div>
            <div className="summary-item">
              <span>Rewards Points</span>
              <strong>18,240</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DashboardMain;