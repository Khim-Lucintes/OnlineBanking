import React, { useState, useEffect } from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";

function AccountApprovals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("/api/admin/account-approvals", {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        setMessage(data.message || "Failed to load pending approvals");
      }
    } catch (error) {
      setMessage("Server error while loading approvals");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId, action) => {
    setMessage("");

    try {
      const response = await fetch(`/api/admin/account-approvals/${userId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to process request");
        return;
      }

      setMessage(data.message || "Request processed successfully");
      fetchPendingUsers();
    } catch (error) {
      setMessage("Server error while processing approval");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <main className="dashboard-main banking-dashboard">
      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h3>Account Approvals</h3>
            <span className="panel-subtitle">
              Review and process pending user registrations
            </span>
          </div>
        </div>

        {message && (
          <p style={{ color: "#8ad8ff", marginBottom: "14px" }}>{message}</p>
        )}

        {loading ? (
          <div className="empty-state">Loading pending approvals...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No pending account approvals.</div>
        ) : (
          <div className="transaction-table-wrapper">
            <table className="dashboard-transaction-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Email Verified</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role_name || "Customer"}</td>
                    <td>{Number(user.email_verified) === 1 ? "Yes" : "No"}</td>
                    <td>{user.created_at}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          className="panel-action-btn"
                          onClick={() => updateStatus(user.user_id, "approve")}
                        >
                          Approve
                        </button>

                        <button
                          className="panel-action-btn"
                          onClick={() => updateStatus(user.user_id, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AccountApprovals;