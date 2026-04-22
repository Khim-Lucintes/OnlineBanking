import React, { useState } from "react";

function TestAdmin() {
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const testCreateAdmin = async () => {
    setLoading(true);
    setResponseMsg("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        setResponseMsg("❌ No logged in user found");
        setLoading(false);
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/superadmin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Admin-User-Id": user.user_id, // 🔥 VERY IMPORTANT
        },
        body: JSON.stringify({
          username: "admin_" + Date.now(),
          email: "admin" + Date.now() + "@test.com",
          password: "12345678",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponseMsg(`❌ ${data.message || "Request failed"} (Status: ${res.status})`);
      } else {
        setResponseMsg(`✅ ${data.message || "Admin created successfully"}`);
      }

      console.log("FULL RESPONSE:", data);

    } catch (err) {
      console.error(err);
      setResponseMsg("❌ Server error");
    }

    setLoading(false);
  };

  const checkCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      setResponseMsg("❌ No user in localStorage");
      return;
    }

    setResponseMsg(
      `👤 User ID: ${user.user_id} | Role: ${user.role_id}`
    );
  };

  return (
    <div style={{
      padding: "40px",
      color: "#fff",
      background: "#0b1a2b",
      minHeight: "100vh"
    }}>
      <h2>🧪 SuperAdmin Test Panel</h2>

      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <button onClick={checkCurrentUser} style={btnStyle}>
          Check Current User
        </button>

        <button onClick={testCreateAdmin} style={btnStyle}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>

      {responseMsg && (
        <div style={{
          marginTop: "20px",
          padding: "12px",
          background: "#112b45",
          borderRadius: "8px"
        }}>
          {responseMsg}
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "10px 16px",
  background: "#1f6feb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default TestAdmin;