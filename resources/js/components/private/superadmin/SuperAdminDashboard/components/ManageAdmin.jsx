import React, { useEffect, useMemo, useState } from "react";
import CreateAdminModal from "./CreateAdminModal";
import "../../../../../../css/SuperAdmin/components/ManageAdmins.css";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [formLoading, setFormLoading] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const requestHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-User-Id": adminUserId,
    }),
    [adminUserId]
  );

  const fetchAdmins = async () => {
    try {
      setTableLoading(true);

      const res = await fetch("/api/superadmin/admins", {
        headers: requestHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.message || "Failed to load admins",
        });
        setAdmins([]);
        return;
      }

      setAdmins(data.admins || []);
    } catch {
      setToast({ type: "error", message: "Failed to load admins" });
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const res = await fetch("/api/superadmin/create-admin", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setToast({ type: "error", message: firstError });
        } else {
          setToast({
            type: "error",
            message: data.message || "Failed to create admin",
          });
        }
        return;
      }

      setToast({
        type: "success",
        message: data.message || "Admin created successfully",
      });
      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch {
      setToast({
        type: "error",
        message: "Server error while creating admin",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const executeAction = async () => {
    if (!confirmModal) return;

    const { type, admin } = confirmModal;
    let url = "";

    if (type === "deactivate") {
      url = `/api/superadmin/admins/${admin.user_id}/deactivate`;
    } else if (type === "activate") {
      url = `/api/superadmin/admins/${admin.user_id}/activate`;
    } else if (type === "demote") {
      url = `/api/superadmin/demote/${admin.user_id}`;
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: requestHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.message || "Action failed" });
        return;
      }

      setToast({
        type: "success",
        message: data.message || "Action completed",
      });
      fetchAdmins();
    } catch {
      setToast({ type: "error", message: "Server error" });
    } finally {
      setConfirmModal(null);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const q = search.toLowerCase();
    return (
      admin.username?.toLowerCase().includes(q) ||
      admin.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <main className="dashboard-main banking-dashboard">
        <section className="dashboard-panel">
          <div className="panel-content">
            <p>Loading admin management...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main banking-dashboard manage-admins-page">
      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h3>Manage Admins</h3>
            <span className="panel-subtitle">
              Control administrator accounts
            </span>
          </div>

          <button
            type="button"
            className="manage-admins-create-btn"
            onClick={() => setShowModal(true)}
          >
            + Create Admin
          </button>
        </div>

        <div className="manage-admins-toolbar">
          <input
            type="text"
            className="manage-admins-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className="manage-admins-clear-btn"
            onClick={() => setSearch("")}
          >
            Clear
          </button>

          <button
            type="button"
            className="manage-admins-clear-btn"
            onClick={fetchAdmins}
            disabled={tableLoading}
          >
            {tableLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="manage-admins-panel">
          <div className="manage-admins-table-wrap">
            <table className="manage-admins-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="manage-admins-empty">
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.user_id}>
                      <td>{admin.user_id}</td>
                      <td>{admin.username}</td>
                      <td>{admin.email}</td>
                      <td>
                        <span
                          className={`manage-admins-status ${admin.status === "Active"
                            ? "status-active"
                            : "status-suspended"
                            }`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td>{admin.created_at}</td>
                      <td>
                        <div className="manage-admins-actions">
                          {admin.status === "Active" ? (
                            <button
                              type="button"
                              className="manage-admins-activate-btn"
                              onClick={() =>
                                setConfirmModal({ type: "deactivate", admin })
                              }
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="manage-admins-activate-btn"
                              onClick={() =>
                                setConfirmModal({ type: "activate", admin })
                              }
                            >
                              Activate
                            </button>
                          )}

                          <button
                            type="button"
                            className="manage-admins-suspend-btn"
                            onClick={() =>
                              setConfirmModal({ type: "demote", admin })
                            }
                          >
                            Demote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CreateAdminModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleCreateAdmin}
        loading={formLoading}
      />

      {confirmModal && (
        <div className="manage-admins-modal-overlay">
          <div className="manage-admins-confirm-modal">
            <h3>
              {confirmModal.type === "deactivate" && "Deactivate Admin"}
              {confirmModal.type === "activate" && "Activate Admin"}
              {confirmModal.type === "demote" && "Demote Admin"}
            </h3>

            <p>
              Are you sure you want to{" "}
              <strong>{confirmModal.type}</strong>{" "}
              <strong>{confirmModal.admin.username}</strong>?
            </p>

            <div className="manage-admins-confirm-actions">
              <button
                type="button"
                className="manage-admins-clear-btn"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="manage-admins-suspend-btn"
                onClick={executeAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`manage-admins-toast ${toast.type === "success" ? "success" : "error"
            }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}

export default ManageAdmins;