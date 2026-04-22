import React, { useState, useEffect, useMemo } from "react";
import "../../../../../../css/DashboardPage/components/DashboardMain.css";
import "../../../../../../css/admin/AdminShared.css";
import AdminTableControls from "./AdminTableControls";
import AdminPagination from "./AdminPagination";
import AdminFilters from "./AdminFilters";
import AdminModal from "./AdminModal";


function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({
    status: "",
    type: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

    return transactions.filter((txn) => {
      const matchesSearch = [
        txn.username,
        txn.transaction_type,
        txn.status,
        txn.account_number,
        txn.reference_no,
        String(txn.transaction_id),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesStatus =
        !filterValues.status || txn.status === filterValues.status;

      const matchesType =
        !filterValues.type || txn.transaction_type === filterValues.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [transactions, search, filterValues]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
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
      type: "",
    });
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Transactions</h3>
            <span>Monitor all system activity</span>
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
                { value: "Completed", label: "Completed" },
                { value: "Pending", label: "Pending" },
                { value: "Failed", label: "Failed" },
              ],
            },
            {
              name: "type",
              options: [
                { value: "", label: "All Types" },
                { value: "Deposit", label: "Deposit" },
                { value: "Withdrawal", label: "Withdrawal" },
                { value: "Transfer", label: "Transfer" },
                { value: "Bill Payment", label: "Bill Payment" },
              ],
            },
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
                    <tr
                      key={txn.transaction_id}
                      onClick={() => setSelectedTransaction(txn)}
                    >
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

      <AdminModal
        open={!!selectedTransaction}
        title="Transaction Details"
        onClose={() => setSelectedTransaction(null)}
      >
        {selectedTransaction && (
          <div className="admin-detail-grid">
            <div className="admin-detail-card">
              <span>Transaction ID</span>
              <strong>{selectedTransaction.transaction_id}</strong>
            </div>
            <div className="admin-detail-card">
              <span>User</span>
              <strong>{selectedTransaction.username || "-"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Type</span>
              <strong>{selectedTransaction.transaction_type || "-"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Amount</span>
              <strong>₱{Number(selectedTransaction.amount || 0).toLocaleString()}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Status</span>
              <strong>{selectedTransaction.status || "-"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Account Number</span>
              <strong>{selectedTransaction.account_number || "-"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Reference No</span>
              <strong>{selectedTransaction.reference_no || "-"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Date</span>
              <strong>{selectedTransaction.transaction_date || "-"}</strong>
            </div>
            <div className="admin-detail-card">
              <span>Description</span>
              <strong>{selectedTransaction.description || "-"}</strong>
            </div>
          </div>
        )}
      </AdminModal>
    </main>
  );
}

export default Transactions;