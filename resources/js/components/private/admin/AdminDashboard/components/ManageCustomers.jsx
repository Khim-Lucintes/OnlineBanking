import React from "react";

function ManageCustomers() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-panel">
        <h3>Manage Customers</h3>

        <table className="dashboard-transaction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>khimcustomer</td>
              <td>customer@gmail.com</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ManageCustomers;