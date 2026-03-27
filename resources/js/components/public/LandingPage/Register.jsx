import React from "react";
import "../../../../css/LandingPage/Register.css";

function Register() {
  return (
    <div className="neo-page auth-page">
      <div className="neo-bg-shape neo-bg-one"></div>
      <div className="neo-bg-shape neo-bg-two"></div>
      <div className="neo-bg-grid"></div>

      <div className="neo-container auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <span className="neo-pill">Create Account</span>
            <h1>Start your digital banking journey</h1>
            <p>
              Register for a secure banking account and enjoy modern financial
              features, real-time access, and a premium dashboard experience.
            </p>
          </div>

          <div className="auth-right">
            <h2>Register</h2>
            <p className="auth-subtext">Create your online banking account</p>

            <form className="auth-form">
              <div className="auth-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>

              <div className="auth-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>

              <div className="auth-group">
                <label>Password</label>
                <input type="password" placeholder="Create a password" />
              </div>

              <div className="auth-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm your password" />
              </div>

              <button type="submit" className="neo-btn neo-btn-primary neo-btn-lg auth-submit">
                Create Account
              </button>

              <p className="auth-switch">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;