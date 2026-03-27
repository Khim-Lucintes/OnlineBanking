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
            <div className="atm-card premium-card">
              <div className="atm-card-top">
                <span className="bank-name">MyBank</span>
                <span className="card-type">VISA</span>
              </div>

              <div className="atm-chip"></div>

              <div className="atm-number">
                1234 5678 9012 3456
              </div>

              <div className="atm-bottom">
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