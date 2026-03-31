import React from "react";

function Billers() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-panel">
        <h3>Manage Billers</h3>

        <button className="form-action-btn">+ Add Biller</button>

        <ul className="accounts-list">
          <li>Davao Light</li>
          <li>Water District</li>
        </ul>
      </div>
    </main>
  );
}

export default Billers;