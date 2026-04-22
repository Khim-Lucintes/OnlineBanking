
import React, { useEffect, useMemo, useState } from "react";
import "../../../../../../css/SuperAdmin/components/SecuritySettings.css";

function SecuritySettings() {
  const [settings, setSettings] = useState({
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableTwoFactor: false,
    forcePasswordReset: false,
    singleSessionOnly: false,
    autoLogoutMinutes: 15,
    allowRememberMe: true,
    restrictByIp: false,
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

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/superadmin/security-settings", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load security settings");
        return;
      }

      setSettings(data.settings);
    } catch (err) {
      console.error(err);
      setError("Server error while loading security settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/superadmin/security-settings", {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || "Failed to update security settings");
        }
        return;
      }

      setMessage(data.message || "Security settings updated successfully");
    } catch (err) {
      console.error(err);
      setError("Server error while saving security settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    setMessage("");
    setError("");
  };

  if (loading) {
    return (
      <main className="dashboard-main banking-dashboard security-settings-page">
        <section className="dashboard-panel">
          <div className="panel-content">
            <p>Loading security settings...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main banking-dashboard security-settings-page">
      <section className="dashboard-panel">
        <div className="panel-header security-settings-header">
          <div>
            <h3>Security Settings</h3>
            <span className="panel-subtitle">
              Configure authentication policies, password rules, and access controls
            </span>
          </div>

          <div className="security-settings-actions">
            <button
              type="button"
              className="ss-btn ss-btn-light"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="button"
              className="ss-btn ss-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {message && <div className="security-settings-message">{message}</div>}
        {error && <div className="security-settings-error">{error}</div>}

        <div className="security-settings-grid">
          <div className="security-settings-card">
            <div className="security-settings-card-header">
              <h4>Password Policy</h4>
              <p>Control password complexity and reset rules</p>
            </div>

            <div className="security-settings-form-group">
              <label htmlFor="minPasswordLength">Minimum Password Length</label>
              <input
                id="minPasswordLength"
                name="minPasswordLength"
                type="number"
                value={settings.minPasswordLength}
                onChange={handleChange}
              />
            </div>

            <div className="security-settings-toggle-list">
              <div className="security-settings-toggle-row">
                <span>Require Uppercase Letter</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="requireUppercase"
                    checked={settings.requireUppercase}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>

              <div className="security-settings-toggle-row">
                <span>Require Number</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="requireNumber"
                    checked={settings.requireNumber}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>

              <div className="security-settings-toggle-row">
                <span>Require Special Character</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="requireSpecialChar"
                    checked={settings.requireSpecialChar}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>

              <div className="security-settings-toggle-row">
                <span>Force Password Reset</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="forcePasswordReset"
                    checked={settings.forcePasswordReset}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="security-settings-card">
            <div className="security-settings-card-header">
              <h4>Login Protection</h4>
              <p>Protect against unauthorized access attempts</p>
            </div>

            <div className="security-settings-form-group">
              <label htmlFor="maxLoginAttempts">Maximum Login Attempts</label>
              <input
                id="maxLoginAttempts"
                name="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={handleChange}
              />
            </div>

            <div className="security-settings-form-group">
              <label htmlFor="lockoutDuration">Lockout Duration (minutes)</label>
              <input
                id="lockoutDuration"
                name="lockoutDuration"
                type="number"
                value={settings.lockoutDuration}
                onChange={handleChange}
              />
            </div>

            <div className="security-settings-toggle-list">
              <div className="security-settings-toggle-row">
                <span>Enable Two-Factor Authentication</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="enableTwoFactor"
                    checked={settings.enableTwoFactor}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>

              <div className="security-settings-toggle-row">
                <span>Restrict Access by IP</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="restrictByIp"
                    checked={settings.restrictByIp}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="security-settings-grid">
          <div className="security-settings-card">
            <div className="security-settings-card-header">
              <h4>Session Controls</h4>
              <p>Manage user session behavior and timeout policies</p>
            </div>

            <div className="security-settings-form-group">
              <label htmlFor="autoLogoutMinutes">Auto Logout (minutes)</label>
              <input
                id="autoLogoutMinutes"
                name="autoLogoutMinutes"
                type="number"
                value={settings.autoLogoutMinutes}
                onChange={handleChange}
              />
            </div>

            <div className="security-settings-toggle-list">
              <div className="security-settings-toggle-row">
                <span>Single Session Only</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="singleSessionOnly"
                    checked={settings.singleSessionOnly}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>

              <div className="security-settings-toggle-row">
                <span>Allow Remember Me</span>
                <label className="security-settings-switch">
                  <input
                    type="checkbox"
                    name="allowRememberMe"
                    checked={settings.allowRememberMe}
                    onChange={handleChange}
                  />
                  <span className="security-settings-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="security-settings-card">
            <div className="security-settings-card-header">
              <h4>Security Overview</h4>
              <p>Quick status summary of your current security posture</p>
            </div>

            <div className="security-settings-overview-list">
              <div className="security-settings-overview-item">
                <span>Password Length</span>
                <strong>{settings.minPasswordLength} characters</strong>
              </div>

              <div className="security-settings-overview-item">
                <span>Max Login Attempts</span>
                <strong>{settings.maxLoginAttempts}</strong>
              </div>

              <div className="security-settings-overview-item">
                <span>Lockout Duration</span>
                <strong>{settings.lockoutDuration} mins</strong>
              </div>

              <div className="security-settings-overview-item">
                <span>Two-Factor Authentication</span>
                <strong>{settings.enableTwoFactor ? "Enabled" : "Disabled"}</strong>
              </div>

              <div className="security-settings-overview-item">
                <span>Auto Logout</span>
                <strong>{settings.autoLogoutMinutes} mins</strong>
              </div>

              <div className="security-settings-overview-item">
                <span>IP Restriction</span>
                <strong>{settings.restrictByIp ? "Enabled" : "Disabled"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SecuritySettings;