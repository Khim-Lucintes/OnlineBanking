import React, { useEffect, useState } from "react";
import "../../../../../../css/Admin/DashboardMain.css";
import "../../../../../../css/Admin/components/Reports.css";

import ReportSummaryCards from "./ReportSummaryCards";
import ReportSummaryTable from "./ReportSummaryTable";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/admin/reports/summary", {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load reports");
        return;
      }

      setSummary(data.summary || null);
    } catch (error) {
      setMessage("Server error while loading reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <main className="dashboard-main banking-dashboard">
      <ReportSummaryCards summary={summary} />
      <ReportSummaryTable
        summary={summary}
        loading={loading}
        message={message}
      />
    </main>
  );
}

export default Reports;