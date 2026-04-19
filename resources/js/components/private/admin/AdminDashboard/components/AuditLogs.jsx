import React, { useEffect, useState } from "react";
import "../../../../../../css/Admin/DashboardMain.css";
import "../../../../../../css/Admin/components/AuditLogs.css";
import AuditLogTable from "./AuditLogTable";


function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    action: "",
    date_from: "",
    date_to: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const buildQuery = (customFilters = filters) => {
    const params = new URLSearchParams();

    if (customFilters.search) params.append("search", customFilters.search);
    if (customFilters.action) params.append("action", customFilters.action);
    if (customFilters.date_from) params.append("date_from", customFilters.date_from);
    if (customFilters.date_to) params.append("date_to", customFilters.date_to);

    return params.toString() ? `?${params.toString()}` : "";
  };

  const fetchLogs = async (customFilters = filters) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/audit-logs${buildQuery(customFilters)}`, {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load audit logs");
        return;
      }

      setLogs(data.logs || []);
    } catch (error) {
      setMessage("Server error while loading audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLogs(filters);
  };

  const handleClear = () => {
    const reset = {
      search: "",
      action: "",
      date_from: "",
      date_to: "",
    };

    setFilters(reset);
    fetchLogs(reset);
  };

  const handleExport = () => {
    const query = buildQuery(filters);
    window.open(`/api/admin/audit-logs/export${query}`, "_blank");
  };

  return (
    <main className="audit-page">
      <section className="audit-hero">
        <div>
          <span className="audit-kicker">Security Monitoring</span>
          <h2>Audit Logs</h2>
          <p>Track admin actions and system events in one isolated panel.</p>
        </div>

        <div className="audit-hero-badge">
          <span>{logs.length}</span>
          <small>Filtered Records</small>
        </div>
      </section>

      <section className="audit-search-panel">
        <form className="audit-filter-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            className="audit-search-input"
            placeholder="Search username, action, IP, target ID, or description..."
            value={filters.search}
            onChange={handleChange}
          />

          <select
            name="action"
            className="audit-filter-select"
            value={filters.action}
            onChange={handleChange}
          >
            <option value="">All Actions</option>
            <option value="Login">Login</option>
            <option value="View Reports">View Reports</option>
            <option value="View Transactions">View Transactions</option>
            <option value="Update User Status">Update User Status</option>
            <option value="Approve Account">Approve Account</option>
            <option value="Reject Account">Reject Account</option>
          </select>

          <input
            type="date"
            name="date_from"
            className="audit-filter-date"
            value={filters.date_from}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date_to"
            className="audit-filter-date"
            value={filters.date_to}
            onChange={handleChange}
          />

          <button type="submit" className="audit-search-btn primary">
            Apply
          </button>

          <button
            type="button"
            className="audit-search-btn secondary"
            onClick={handleClear}
          >
            Clear
          </button>

          <button
            type="button"
            className="audit-search-btn export"
            onClick={handleExport}
          >
            Export CSV
          </button>
        </form>
      </section>

      <AuditLogTable logs={logs} loading={loading} message={message} />
    </main>
  );
}

export default AuditLogs;