import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../../css/LandingPage/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("isAuth", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      const roleId = Number(data.user?.role_id);

      if (roleId === 1) navigate("/dashboard");
      else if (roleId === 2) navigate("/admin/dashboard");
      else if (roleId === 3) navigate("/superadmin/dashboard");
      else {
        setError("Unknown user role");
        localStorage.clear();
      }

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">

          {/* LEFT */}
          <div className="auth-left">
            <span className="auth-badge">
                 Secure Access
            </span>

            <h1>
              Welcome back to <br />
              <span>MyBank</span>
            </h1>

            <p>
              Sign in to access your account, manage transactions, and monitor
              your online banking dashboard securely.
            </p>

           
          </div>

          {/* RIGHT */}
          <div className="auth-right">

            <div className="auth-header">
              <div className="auth-logo">MB</div>
              <div className="auth-title">MyBank</div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <form className="auth-form" onSubmit={handleLogin}>

              <div className="auth-group">
                <div className="auth-input">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                </div>
              </div>

              <div className="auth-group">
                <div className="auth-input">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="auth-footer">
                Don’t have an account? <Link to="/register">Create one</Link>
              </p>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;