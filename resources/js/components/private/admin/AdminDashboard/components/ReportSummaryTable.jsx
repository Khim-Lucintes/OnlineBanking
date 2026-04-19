import React from "react";

function ReportSummaryTable({ summary, loading, message }) {
  return (
    <section className="reports-panel-grid">
      <div className="reports-panel">
        <div className="reports-panel-header">
          <div>
            <h3>System Report Summary</h3>
            <span className="reports-panel-subtitle">
              Real-time administrative overview
            </span>
          </div>
        </div>

        {loading ? (
          <div className="reports-empty-state">Loading reports...</div>
        ) : message ? (
          <div className="reports-empty-state">{message}</div>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Accounts</td>
                  <td>{summary?.total_accounts ?? 0}</td>
                </tr>
                <tr>
                  <td>Total Transactions</td>
                  <td>{summary?.total_transactions ?? 0}</td>
                </tr>
                <tr>
                  <td>Completed Transactions</td>
                  <td>
                    <span className="reports-value-positive">
                      {summary?.completed_transactions ?? 0}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Failed Transactions</td>
                  <td>
                    <span className="reports-value-negative">
                      {summary?.failed_transactions ?? 0}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Total System Balance</td>
                  <td>
                    <strong>
                      ₱{Number(summary?.total_balance ?? 0).toLocaleString()}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReportSummaryTable;