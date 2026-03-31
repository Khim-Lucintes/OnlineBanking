import React from "react";

function AuditLogs() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-panel">
        <h3>Audit Logs</h3>

        <ul className="accounts-list">
          <li>Admin logged in</li>
          <li>Customer account created</li>
        </ul>
      </div>
    </main>
  );
}

export default AuditLogs;