import React from "react";

function Profile() {
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
              Update your personal information, manage password settings, and
              keep your account secure.
            </p>
          </div>

          <div className="profile-avatar-card">
            <div className="profile-avatar-large">K</div>
            <div>
              <h4>Khim Lucintes</h4>
              <p>Verified Customer</p>
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
              <label>Full Name</label>
              <input type="text" defaultValue="Khim Lucintes" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="admin@gmail.com" />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input type="text" defaultValue="+63 912 345 6789" />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" defaultValue="Davao City, Philippines" />
            </div>

            <button type="button" className="form-action-btn">
              Save Changes
            </button>
          </form>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Security Settings</h3>
          </div>

          <form className="dashboard-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>

            <button type="button" className="form-action-btn">
              Update Password
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Profile;