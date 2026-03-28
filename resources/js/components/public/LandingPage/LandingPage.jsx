import React from "react";
import { Link } from "react-router-dom";
import "../../../../css/LandingPage/LandingPage.css";

function Home() {
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
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/login" className="neo-btn neo-btn-ghost">
              Login
            </Link>
            <Link to="/register" className="neo-btn neo-btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="neo-hero">
        <div className="neo-container neo-hero-grid">
          <div className="neo-hero-left">
            <span className="neo-pill">Smart Banking Experience</span>

            <h1>
              Banking that feels
              <span> fast, elegant, and future-ready</span>
            </h1>

            <p>
              Experience a premium online banking platform with modern design,
              secure transactions, and a seamless dashboard built for clarity
              and performance.
            </p>

            <div className="neo-hero-actions">
              <a href="/register" className="neo-btn neo-btn-primary neo-btn-lg">
                Open Account
              </a>
              <a href="/about" className="neo-btn neo-btn-secondary neo-btn-lg">
                Explore Features
              </a>
            </div>
          </div>

          <div className="neo-hero-right atm-highlight">
           <div className="neo-hero-right">
  <div className="hero-summary-panel">
    <div className="hero-summary-stat">
      <p>Total Secure Transactions</p>
      <h3>₱2.4M+</h3>
      <span>Processed this month</span>
    </div>

    <div className="hero-summary-stat">
      <p>Active Customers</p>
      <h3>12,500+</h3>
      <span>Growing user base</span>
    </div>

    <div className="hero-summary-stat">
      <p>System Uptime</p>
      <h3>99.9%</h3>
      <span>Reliable platform access</span>
    </div>
  </div>
</div>

            <div className="neo-floating neo-floating-top">
              <p>Quick Transfer</p>
              <h4>₱12,500</h4>
              <span>Sent successfully</span>
            </div>

            <div className="neo-floating neo-floating-bottom">
              <p>Rewards</p>
              <h4>18,240 pts</h4>
              <span>Updated today</span>
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

         
        </div>
      </footer>
    </div>
  );
}

export default Home;