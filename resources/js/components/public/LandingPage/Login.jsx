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

      if (roleId === 1) {
        navigate("/dashboard");
      } else if (roleId === 2) {
        navigate("/admin/dashboard");
      } else if (roleId === 3) {
        navigate("/superadmin/dashboard");
      } else {
        setError("Unknown user role");
        localStorage.removeItem("isAuth");
        localStorage.removeItem("user");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
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

            {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="neo-btn neo-btn-primary neo-btn-lg auth-submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="auth-switch">
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