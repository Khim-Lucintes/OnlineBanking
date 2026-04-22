import React, { useEffect, useMemo, useState } from "react";
import "../../../../../../css/SuperAdmin/components/SystemConfiguration.css";
import "../../../../../../css/SuperAdmin/components/SystemConfiguration.css";

function SystemConfiguration() {
  const [config, setConfig] = useState({
    dailyTransferLimit: 50000,
    maxBillPayment: 20000,
    minPasswordLength: 8,
    sessionTimeout: 15,
    accountApprovalRequired: true,
    allowRegistration: true,
    enableTransfers: true,
    enableBillPayments: true,
    enableReportsModule: true,
    enableAuditLogs: true,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const requestHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-User-Id": adminUserId,
    }),
    [adminUserId]
  );

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/superadmin/system-config", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load system configuration");
        return;
      }

      setConfig(data.config);
    } catch (err) {
      console.error(err);
      setError("Server error while loading system configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/superadmin/system-config", {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || "Failed to update system configuration");
        }
        return;
      }

      setMessage(data.message || "System configuration updated successfully");
    } catch (err) {
      console.error(err);
      setError("Server error while saving system configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchConfig();
    setMessage("");
    setError("");
  };

  if (loading) {
    return (
      <main className="dashboard-main banking-dashboard system-config-page">
        <section className="dashboard-panel">
          <div className="panel-content">
            <p>Loading system configuration...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main banking-dashboard system-config-page">
      <section className="dashboard-panel">
        <div className="panel-header system-config-header">
          <div>
            <h3>System Configuration</h3>
            <span className="panel-subtitle">
              Manage system settings, limits, rules, and modules
            </span>
          </div>

          <div className="system-config-actions">
            <button
              type="button"
              className="sc-btn sc-btn-light"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="button"
              className="sc-btn sc-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {message && <div className="system-config-message">{message}</div>}
        {error && <div className="system-config-error">{error}</div>}

        <div className="system-config-grid">
          <div className="system-config-card">
            <div className="system-config-card-header">
              <h4>Transaction Limits</h4>
              <p>Control financial thresholds across the system</p>
            </div>

            <div className="system-config-form-group">
              <label htmlFor="dailyTransferLimit">Daily Transfer Limit</label>
              <input
                id="dailyTransferLimit"
                name="dailyTransferLimit"
                type="number"
                value={config.dailyTransferLimit}
                onChange={handleChange}
              />
            </div>

            <div className="system-config-form-group">
              <label htmlFor="maxBillPayment">Maximum Bill Payment</label>
              <input
                id="maxBillPayment"
                name="maxBillPayment"
                type="number"
                value={config.maxBillPayment}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="system-config-card">
            <div className="system-config-card-header">
              <h4>Security Rules</h4>
              <p>Set password and session requirements</p>
            </div>

            <div className="system-config-form-group">
              <label htmlFor="minPasswordLength">Minimum Password Length</label>
              <input
                id="minPasswordLength"
                name="minPasswordLength"
                type="number"
                value={config.minPasswordLength}
                onChange={handleChange}
              />
            </div>

            <div className="system-config-form-group">
              <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
              <input
                id="sessionTimeout"
                name="sessionTimeout"
                type="number"
                value={config.sessionTimeout}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="system-config-grid">
          <div className="system-config-card">
            <div className="system-config-card-header">
              <h4>Access & Approval Rules</h4>
              <p>Manage registration and account approval behavior</p>
            </div>

            <div className="system-config-toggle-list">
              <div className="system-config-toggle-row">
                <span>Account Approval Required</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="accountApprovalRequired"
                    checked={config.accountApprovalRequired}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>

              <div className="system-config-toggle-row">
                <span>Allow New Registration</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="allowRegistration"
                    checked={config.allowRegistration}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="system-config-card">
            <div className="system-config-card-header">
              <h4>Module Controls</h4>
              <p>Enable or disable major system modules</p>
            </div>

            <div className="system-config-toggle-list">
              <div className="system-config-toggle-row">
                <span>Enable Transfers</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="enableTransfers"
                    checked={config.enableTransfers}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>

              <div className="system-config-toggle-row">
                <span>Enable Bill Payments</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="enableBillPayments"
                    checked={config.enableBillPayments}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>

              <div className="system-config-toggle-row">
                <span>Enable Reports Module</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="enableReportsModule"
                    checked={config.enableReportsModule}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>

              <div className="system-config-toggle-row">
                <span>Enable Audit Logs</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="enableAuditLogs"
                    checked={config.enableAuditLogs}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>

              <div className="system-config-toggle-row">
                <span>Maintenance Mode</span>
                <label className="system-config-switch">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={config.maintenanceMode}
                    onChange={handleChange}
                  />
                  <span className="system-config-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SystemConfiguration;