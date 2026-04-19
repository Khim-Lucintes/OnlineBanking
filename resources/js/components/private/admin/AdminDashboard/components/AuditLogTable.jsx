import React from "react";

function AuditLogTable({ logs, loading, message }) {
  return (
    <section className="audit-panel-grid">
      <div className="audit-panel">
        <div className="audit-panel-header">
          <div>
            <h3>Audit Trail</h3>
            <span className="audit-panel-subtitle">
              Recent administrative activities and recorded events
            </span>
          </div>
        </div>

        {loading ? (
          <div className="audit-empty-state">Loading audit logs...</div>
        ) : message ? (
          <div className="audit-empty-state">{message}</div>
        ) : logs.length === 0 ? (
          <div className="audit-empty-state">No audit logs found.</div>
        ) : (
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target Type</th>
                  <th>Target ID</th>
                  <th>Description</th>
                  <th>IP Address</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.log_id}>
                    <td>{log.log_id}</td>
                    <td>
                      <div className="audit-user-cell">
                        <strong>{log.username || "N/A"}</strong>
                        <span>{log.email || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="audit-chip">{log.action}</span>
                    </td>
                    <td>{log.target_type || "-"}</td>
                    <td>{log.target_id || "-"}</td>
                    <td>{log.description || "-"}</td>
                    <td>{log.ip_address || "-"}</td>
                    <td>{log.log_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AuditLogTable;