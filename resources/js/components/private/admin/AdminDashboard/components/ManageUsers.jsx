import React, { useEffect, useState ,useMemo} from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";

import AdminTableControls from "./AdminTableControls";
import AdminPagination from "./AdminPagination";


function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

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

    let result = users.filter((user) =>
      [
        user.username,
        user.email,
        user.role_name,
        user.status,
        String(user.user_id),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );

    result.sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortKey, sortOrder]);

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Manage Users</h3>
            <span>Control customer accounts</span>
          </div>
        </div>

        <AdminTableControls
          search={search}
          setSearch={setSearch}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortOptions={[
            { value: "username", label: "Username" },
            { value: "email", label: "Email" },
            { value: "status", label: "Status" },
            { value: "role_name", label: "Role" },
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
                    <tr key={user.user_id}>
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
                      <td>
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
    </main>
  );
}

export default ManageUsers;