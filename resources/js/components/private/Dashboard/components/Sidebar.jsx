import React from "react";
import "../../../../../css/DashboardPage/components/Sidebar.css";
import Sidebarlist from "./Sidebarlist";


function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brand">
        <div className="dashboard-brand-icon">MB</div>
        <div>
          <h2>MyBank</h2>
          <span>Online Banking</span>
        </div>
      </div>

      <Sidebarlist activePage={activePage} setActivePage={setActivePage} />
    </aside>
  );
}

export default Sidebar;