import React from "react";
import { useEffect, useState } from "react";
import "../../../../../css/DashboardPage/components/Profile.css";

function Profile({ dashboardData }) {
  const user = dashboardData?.user || {};
  const accounts = dashboardData?.accounts || [];
  const totalBalance = Number(dashboardData?.total_balance || 0);

  const formatAmount = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  return (
    <main className="dashboard-main profile-page">
      <section className="profile-hero">
        <div className="profile-hero-left">
          <span className="profile-badge">Customer Profile</span>
          <h2>Manage your account profile</h2>
          <p>
            Review your identity, account status, linked banking information,
            and customer details in one secure place.
          </p>
        </div>

        <div className="profile-hero-right">
          <div className="profile-balance-card">
            <span>Total Portfolio Value</span>
            <h1>{formatAmount(totalBalance)}</h1>
            <p>{accounts.length} linked account(s)</p>
          </div>
        </div>
      </section>

      <section className="profile-summary-grid">
        <div className="profile-highlight-card">
          <div className="profile-highlight-top">
            <div className="profile-avatar-large">
              {(user.username || "C").charAt(0).toUpperCase()}
            </div>

            <div className="profile-highlight-info">
              <span className="profile-role-chip">Verified Customer</span>
              <h3>{user.username || "Customer"}</h3>
              <p>{user.email || "No email found"}</p>
            </div>
          </div>

          <div className="profile-highlight-meta">
            <div>
              <label>User ID</label>
              <strong>{user.user_id || "N/A"}</strong>
            </div>
            <div>
              <label>Status</label>
              <strong>{user.status || "Active"}</strong>
            </div>
          </div>
        </div>

        <div className="profile-stat-card">
          <span>Email Verification</span>
          <h3>{Number(user.email_verified) === 1 ? "Verified" : "Pending"}</h3>
          <p>Security verification status</p>
        </div>

        <div className="profile-stat-card">
          <span>Linked Accounts</span>
          <h3>{accounts.length}</h3>
          <p>Banking accounts connected</p>
        </div>

        <div className="profile-stat-card">
          <span>Created At</span>
          <h3>{user.created_at ? "Recorded" : "N/A"}</h3>
          <p>{user.created_at || "No timestamp found"}</p>
        </div>
      </section>

      <section className="profile-grid">
        <div className="dashboard-panel profile-panel">
          <div className="panel-header">
            <div>
              <h3>Personal Information</h3>
              <span className="panel-subtitle">
                Registered customer details
              </span>
            </div>
          </div>

          <form className="profile-form">
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

        <div className="dashboard-panel profile-panel">
          <div className="panel-header">
            <div>
              <h3>Account Metadata</h3>
              <span className="panel-subtitle">
                System-level customer information
              </span>
            </div>
          </div>

          <div className="profile-info-list">
            <div className="profile-info-item">
              <span>User ID</span>
              <strong>{user.user_id || "N/A"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Primary Account</span>
              <strong>{accounts[0]?.account_number || "N/A"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Primary Account Type</span>
              <strong>{accounts[0]?.account_type || "N/A"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Created At</span>
              <strong>{user.created_at || "N/A"}</strong>
            </div>
          </div>

          <div className="profile-note-box">
            <p>
              Keep your profile information secure. Contact system support if
              any customer account details appear incorrect.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;