import React, { useEffect, useState } from "react";
import "../../../../../../css/Admin/components/PendingApproval.css";

function PendingApproval() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [status, setStatus] = useState(user?.status || "pending");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/user/status", {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": user?.user_id,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.status);

        // ✅ If approved → redirect
        if (data.status === "active") {
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      console.error("Failed to check status");
    }
  };

  useEffect(() => {
    const interval = setInterval(checkStatus, 5000); // check every 5s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="pending-page">
      <div className="pending-card">
        <div className="pending-icon">⏳</div>

        <h2>Account Pending Approval</h2>

        <p className="pending-text">
          Your account is currently under review by the admin.
        </p>

        <p className="pending-subtext">
          Please wait while we verify your information.
        </p>

        <div className="pending-status">
          Status: <span className="status-badge">{status}</span>
        </div>

        <button className="pending-btn" onClick={checkStatus}>
          🔄 Check Status
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default PendingApproval;