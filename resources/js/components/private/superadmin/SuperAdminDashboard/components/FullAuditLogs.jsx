import React, { useEffect, useMemo, useState } from "react";
import "../../../../../../css/SuperAdmin/components/FullAuditLogs.css";

function FullAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const requestHeaders = useMemo(
    () => ({
      Accept: "application/json",
      "X-Admin-User-Id": adminUserId,
    }),
    [adminUserId]
  );

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (actionFilter.trim()) params.append("action", actionFilter.trim());
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    return params.toString();
  };

  const fetchLogs = async () => {
    try {
      setTableLoading(true);

      const query = buildQueryString();
      const url = query
        ? `/api/superadmin/audit-logs?${query}`
        : "/api/superadmin/audit-logs";

      const res = await fetch(url, {
        method: "GET",
        headers: requestHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.message || "Failed to load audit logs",
        });
        setLogs([]);
        return;
      }

      setLogs(data.logs || []);
    } catch {
      setToast({
        type: "error",
        message: "Server error while loading audit logs",
      });
      setLogs([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleApplyFilters = () => {
    fetchLogs();
  };

  const handleClearFilters = () => {
    setSearch("");
    setActionFilter("");
    setDateFrom("");
    setDateTo("");

    setTimeout(() => {
      fetchLogs();
    }, 0);
  };

  const handleExport = async () => {
    try {
      setToast(null);

      const query = buildQueryString();
      const url = query
        ? `/api/superadmin/audit-logs/export?${query}`
        : `/api/superadmin/audit-logs/export`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/csv",
          "X-Admin-User-Id": adminUserId,
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to export audit logs";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) { }

        setToast({
          type: "error",
          message: errorMessage,
        });
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `superadmin_audit_logs_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "_")}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setToast({
        type: "success",
        message: "Audit logs exported successfully",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: "Server error while exporting audit logs",
      });
    }
  };

  const uniqueActions = [...new Set(logs.map((log) => log.action).filter(Boolean))];

  if (loading) {
    return (
      <main className="dashboard-main banking-dashboard full-audit-logs-page">
        <section className="dashboard-panel">
          <div className="panel-content">
            <p>Loading audit logs...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main banking-dashboard full-audit-logs-page">
      <section className="dashboard-panel">
        <div className="panel-header fal-header">
          <div>
            <h3>Full Audit Logs</h3>
            <span className="panel-subtitle">
              View all system and user activity logs for compliance and investigations
            </span>
          </div>

          <div className="fal-header-actions">
            <button
              type="button"
              className="fal-btn fal-btn-light"
              onClick={fetchLogs}
              disabled={tableLoading}
            >
              {tableLoading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              className="fal-btn fal-btn-primary"
              onClick={handleExport}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="fal-filter-grid">
          <input
            type="text"
            className="fal-input"
            placeholder="Search logs, user, action, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="fal-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="fal-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <input
            type="date"
            className="fal-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          <button
            type="button"
            className="fal-btn fal-btn-primary"
            onClick={handleApplyFilters}
          >
            Apply
          </button>

          <button
            type="button"
            className="fal-btn fal-btn-light"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>

        <div className="fal-table-panel">
          <div className="fal-table-wrap">
            <table className="fal-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Description</th>
                  <th>IP Address</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="fal-empty">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.log_id}>
                      <td>#{log.log_id}</td>
                      <td>
                        <div className="fal-user-cell">
                          <div className="fal-user-name">
                            {log.username || "System"}
                          </div>
                          <div className="fal-user-email">
                            {log.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fal-action-badge">
                          {log.action || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="fal-target-cell">
                          <span>{log.target_type || "N/A"}</span>
                          <small>
                            {log.target_id !== null && log.target_id !== undefined
                              ? `#${log.target_id}`
                              : "—"}
                          </small>
                        </div>
                      </td>
                      <td className="fal-description">
                        {log.description || "No description"}
                      </td>
                      <td>{log.ip_address || "N/A"}</td>
                      <td>{log.log_date || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {toast && (
        <div className={`fal-toast ${toast.type === "success" ? "success" : "error"}`}>
          {toast.message}
        </div>
      )}
    </main>
  );
}

export default FullAuditLogs;