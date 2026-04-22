import React, { useState } from "react";
import "../../../../../../css/SuperAdmin/components/BackupRestore.css";


function BackupRestore() {
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const headers = {
    "X-Admin-User-Id": user?.user_id,
  };

  const handleBackup = async () => {
    try {
      setLoadingBackup(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/superadmin/backup", {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        throw new Error("Backup failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.sql";
      a.click();

      setMessage("Backup downloaded successfully");
    } catch (err) {
      setError("Backup failed");
    } finally {
      setLoadingBackup(false);
    }
  };

  const handleRestore = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoadingRestore(true);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("backup_file", file);

      const response = await fetch("/api/superadmin/restore", {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Restore failed");
        return;
      }

      setMessage(data.message);
    } catch (err) {
      setError("Restore failed");
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <main className="dashboard-main banking-dashboard">
      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Backup & Restore</h3>
          <span className="panel-subtitle">
            Manage database backups and recovery
          </span>
        </div>

        {message && <div className="br-success">{message}</div>}
        {error && <div className="br-error">{error}</div>}

        <div className="br-grid">
          {/* BACKUP */}
          <div className="br-card">
            <h4>Backup Database</h4>
            <p>Create a full backup of the system database.</p>

            <button onClick={handleBackup} disabled={loadingBackup}>
              {loadingBackup ? "Backing up..." : "Download Backup"}
            </button>
          </div>

          {/* RESTORE */}
          <div className="br-card">
            <h4>Restore Database</h4>
            <p>Upload a backup file to restore the system.</p>

            <input
              type="file"
              accept=".sql"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleRestore} disabled={loadingRestore}>
              {loadingRestore ? "Restoring..." : "Restore Database"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BackupRestore;