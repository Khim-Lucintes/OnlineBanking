import React, { useState, useEffect, useMemo } from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";
import "../../../../../../css/admin/AdminShared.css";
import AdminTableControls from "./AdminTableControls";
import AdminPagination from "./AdminPagination";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("transaction_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminUserId = storedUser?.user_id || "";

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/transactions", {
        headers: {
          Accept: "application/json",
          "X-Admin-User-Id": adminUserId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load transactions");
        return;
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      setMessage("Server error while loading transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    let result = transactions.filter((txn) =>
      [
        txn.username,
        txn.transaction_type,
        txn.status,
        txn.account_number,
        txn.reference_no,
        String(txn.transaction_id),
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
  }, [transactions, search, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
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
            <h3>Transactions</h3>
            <span>Monitor all system activity</span>
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
            { value: "transaction_date", label: "Date" },
            { value: "username", label: "User" },
            { value: "transaction_type", label: "Type" },
            { value: "status", label: "Status" },
          ]}
        />

        {loading ? (
          <div className="admin-empty">Loading transactions...</div>
        ) : paginatedTransactions.length === 0 ? (
          <div className="admin-empty">No transactions found.</div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTransactions.map((txn) => (
                    <tr key={txn.transaction_id}>
                      <td>{txn.transaction_id}</td>
                      <td>{txn.username}</td>
                      <td>{txn.transaction_type}</td>
                      <td>₱{Number(txn.amount).toLocaleString()}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            txn.status === "Completed" ? "active" : "suspended"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td>{txn.transaction_date}</td>
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

export default Transactions;