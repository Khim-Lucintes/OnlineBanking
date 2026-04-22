import React, { useEffect, useState ,useMemo} from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";
import "../../../../../../css/admin/AdminShared.css";

import AdminTableControls from "./AdminTableControls";
import AdminPagination from "./AdminPagination";
import AdminFilters from "./AdminFilters";
import AdminModal from "./AdminModal";


function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({
    status: "",
    role: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const rowsPerPage = 8;

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load users");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      setMessage("Server error while loading users");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId, status) => {
    setMessage("");

    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update status");
        return;
      }

      setMessage(data.message || "User status updated");
      fetchUsers();
    } catch (error) {
      setMessage("Server error while updating status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch = [
        user.username,
        user.email,
        user.role_name,
        user.status,
        String(user.user_id),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesStatus =
        !filterValues.status || user.status === filterValues.status;

      const matchesRole =
        !filterValues.role || user.role_name === filterValues.role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, filterValues]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterValues]);

  const handleFilterChange = (e) => {
    setFilterValues({
      ...filterValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterValues({
      status: "",
      role: "",
    });
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Manage Users</h3>
            <span>Control customer accounts</span>
          </div>
        </div>

        <AdminFilters
          search={search}
          setSearch={setSearch}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          filters={[
            {
              name: "status",
              options: [
                { value: "", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Suspended", label: "Suspended" },
              ],
            },
            {
              name: "role",
              options: [
                { value: "", label: "All Roles" },
                { value: "Customer", label: "Customer" },
                { value: "Admin", label: "Admin" },
                { value: "SuperAdmin", label: "SuperAdmin" },
              ],
            },
          ]}
        />

        {loading ? (
          <div className="admin-empty">Loading users...</div>
        ) : paginatedUsers.length === 0 ? (
          <div className="admin-empty">No users found.</div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.user_id} onClick={() => setSelectedUser(user)}>
                      <td>{user.user_id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role_name || "N/A"}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            user.status === "Active" ? "active" : "suspended"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            className="admin-btn primary"
                            type="button"
                            onClick={() => updateStatus(user.user_id, "Active")}
                          >
                            Activate
                          </button>
                          <button
                            className="admin-btn danger"
                            type="button"
                            onClick={() => updateStatus(user.user_id, "Suspended")}
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {message && <div className="admin-empty">{message}</div>}
      </section>

      <AdminModal
        open={!!selectedUser}
        title="User Details"
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <div className="admin-detail-grid">
            <div className="admin-detail-card">
              <span>User ID</span>
              <strong>{selectedUser.user_id}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Username</span>
              <strong>{selectedUser.username}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Email</span>
              <strong>{selectedUser.email}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Role</span>
              <strong>{selectedUser.role_name || "N/A"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Status</span>
              <strong>{selectedUser.status}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Email Verified</span>
              <strong>{Number(selectedUser.email_verified) === 1 ? "Yes" : "No"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Created At</span>
              <strong>{selectedUser.created_at || "-"}</strong>
            </div>
          </div>
        )}
      </AdminModal>
    </main>
  );
}

export default ManageUsers;