import React from "react";

function Transactions() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-panel">
        <h3>All Transactions</h3>

        <table className="dashboard-transaction-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TRF123</td>
              <td>Transfer</td>
              <td className="negative">₱-500</td>
              <td>Completed</td>
              <td>2026-03-30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Transactions;