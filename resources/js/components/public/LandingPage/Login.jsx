import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../../css/LandingPage/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // DEMO ACCOUNT
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("isAuth", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="neo-page auth-page">
      <div className="neo-bg-shape neo-bg-one"></div>
      <div className="neo-bg-shape neo-bg-two"></div>
      <div className="neo-bg-grid"></div>

      <div className="neo-container auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <span className="neo-pill">Secure Access</span>
            <h1>Welcome back to MyBank</h1>
            <p>
              Sign in to access your account, manage transactions, and monitor
              your online banking dashboard securely.
            </p>
          </div>

          <div className="auth-right">
            <h2>Login</h2>
            <p className="auth-subtext">Enter your credentials to continue</p>

            {/* ERROR MESSAGE */}
            {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="auth-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="neo-btn neo-btn-primary neo-btn-lg auth-submit"
              >
                Sign In
              </button>

              <p className="auth-switch">
                Don’t have an account?{" "}
                <Link to="/register">Create one</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;