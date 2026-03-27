import React from "react";
import "../../../../css/LandingPage/LandingPage.css";

function About() {
  return (
    <div className="neo-page">
      <div className="neo-bg-shape neo-bg-one"></div>
      <div className="neo-bg-shape neo-bg-two"></div>
      <div className="neo-bg-grid"></div>

      <header className="neo-header">
        <div className="neo-container neo-header-inner">
          <div className="neo-brand">
            <div className="neo-brand-icon">MB</div>
            <div>
              <h2>MyBank</h2>
              <span>Next-gen digital banking</span>
            </div>
          </div>

          <nav className="neo-nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>

      <section className="neo-section">
        <div className="neo-container">
          <div className="neo-section-head">
            <span className="neo-pill neo-pill-soft">About Online Banking</span>
            <h2>Secure, accessible, and built for modern financial needs</h2>
            <p>
              Online banking allows users to manage their accounts, transfer
              funds, view balances, monitor transactions, and access banking
              services anytime through a digital platform.
            </p>
          </div>

          <div className="neo-showcase-grid">
            <div className="neo-info-card">
              <h3>What is Online Banking?</h3>
              <p>
                Online banking is a digital service that allows customers to
                perform financial transactions over the internet without going
                to a physical bank branch.
              </p>
            </div>

            <div className="neo-info-card">
              <h3>Why It Matters</h3>
              <p>
                It gives users convenience, speed, and real-time access to
                their finances, making banking more efficient and available
                24/7.
              </p>
            </div>

            <div className="neo-info-card">
              <h3>Core Features</h3>
              <p>
                Users can check balances, transfer money, pay bills, review
                statements, update account details, and monitor activity
                securely.
              </p>
            </div>

            <div className="neo-info-card">
              <h3>Security Focus</h3>
              <p>
                Modern online banking platforms use authentication, encryption,
                secure sessions, and monitoring tools to protect sensitive user
                information and transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="neo-section neo-section-alt">
        <div className="neo-container">
          <div className="neo-section-head">
            <span className="neo-pill neo-pill-soft">Advantages</span>
            <h2>Why users prefer digital banking systems</h2>
          </div>

          <div className="neo-feature-grid">
            <div className="neo-feature-card">
              <div className="neo-feature-icon">01</div>
              <h3>24/7 Access</h3>
              <p>
                Customers can access their accounts any time using desktop or
                mobile devices.
              </p>
            </div>

            <div className="neo-feature-card">
              <div className="neo-feature-icon">02</div>
              <h3>Fast Transactions</h3>
              <p>
                Sending money, paying bills, and checking updates becomes
                quicker and more efficient.
              </p>
            </div>

            <div className="neo-feature-card">
              <div className="neo-feature-icon">03</div>
              <h3>Reduced Paperwork</h3>
              <p>
                Account statements and transaction history can be viewed
                digitally without printed documents.
              </p>
            </div>

            <div className="neo-feature-card">
              <div className="neo-feature-icon">04</div>
              <h3>Better Monitoring</h3>
              <p>
                Users can track spending, deposits, transfers, and account
                activity in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="neo-footer">
        <div className="neo-container neo-footer-inner">
          <div>
            <h3>MyBank</h3>
            <p>Modern digital banking for a smarter financial experience.</p>
          </div>

          <div className="neo-footer-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/dashboard">Dashboard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;