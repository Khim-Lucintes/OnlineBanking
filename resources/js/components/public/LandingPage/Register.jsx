import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../../css/LandingPage/Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Register API error:", data);

        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.error || data.message || "Registration failed");
        }
        return;
      }

      setSuccess(data.message || "Customer account created successfully");

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Register request failed:", err);
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
            <span className="neo-pill">Create Account</span>
            <h1>Start your digital banking journey</h1>
            <p>
              Register a customer account and access your banking dashboard.
            </p>
          </div>

          <div className="auth-right">
            <h2>Register</h2>
            <p className="auth-subtext">Create your customer account</p>

            {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
            {success && <p style={{ color: "#63f0b1" }}>{success}</p>}

            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="neo-btn neo-btn-primary neo-btn-lg auth-submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;