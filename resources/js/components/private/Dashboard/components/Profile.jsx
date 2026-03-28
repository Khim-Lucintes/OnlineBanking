import React from "react";
import { useEffect, useState } from "react";

function Profile({ dashboardData }) {
  const user = dashboardData?.user || {};

  return (
    <main className="dashboard-main">
      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Customer Profile</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Profile & Security</h3>
            </div>
            <p className="section-description">
              View your real customer information from MySQL.
            </p>
          </div>

          <div className="profile-avatar-card">
            <div className="profile-avatar-large">
              {(user.username || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <h4>{user.username || "Customer"}</h4>
              <p>{user.status || "Active"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Personal Information</h3>
          </div>

          <form className="dashboard-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={user.username || ""} readOnly />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={user.email || ""} readOnly />
            </div>

            <div className="form-group">
              <label>Status</label>
              <input type="text" value={user.status || ""} readOnly />
            </div>

            <div className="form-group">
              <label>Email Verified</label>
              <input
                type="text"
                value={Number(user.email_verified) === 1 ? "Yes" : "No"}
                readOnly
              />
            </div>
          </form>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Account Metadata</h3>
          </div>

          <form className="dashboard-form">
            <div className="form-group">
              <label>User ID</label>
              <input type="text" value={user.user_id || ""} readOnly />
            </div>

            <div className="form-group">
              <label>Created At</label>
              <input type="text" value={user.created_at || ""} readOnly />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Profile;