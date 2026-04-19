import React from "react";
import "../../../css/DashboardPage/components/Sidebar.css";

import CustomerSidebar from "../private/customer/Dashboard/components/Sidebarlist";
import AdminSidebar from "../private/admin/AdminDashboard/components/Sidebarlist";

function Sidebar({ activePage, setActivePage }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const roleId = Number(user?.role_id);

  let SidebarComponent;

  if (roleId === 2) {
    SidebarComponent = AdminSidebar;
  } else {
    SidebarComponent = CustomerSidebar;
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brand">
        <div className="dashboard-brand-icon">MB</div>
        <div>
          <h2>MyBank</h2>
          <span>Online Banking</span>
        </div>
      </div>

      <SidebarComponent
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </aside>
  );
}

export default Sidebar;