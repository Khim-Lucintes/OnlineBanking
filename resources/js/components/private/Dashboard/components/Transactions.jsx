import React, { useEffect, useMemo, useState } from "react";
import "../../../../../css/DashboardPage/components/Transactions.css";

function Transactions({ dashboardData }) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: "All",
    search: "",
  });

  const user = dashboardData?.user || {};

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.user_id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/transactions/${user.user_id}`, {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAllTransactions(data.transactions || []);
        } else {
          console.error(data.message || "Failed to load transactions");
        }
      } catch (error) {
        console.error("Transactions fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.user_id]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      const txnDate = txn.transaction_date
        ? new Date(txn.transaction_date)
        : null;

      const fromOk = filters.dateFrom
        ? txnDate && txnDate >= new Date(filters.dateFrom)
        : true;

      const toOk = filters.dateTo
        ? txnDate && txnDate <= new Date(filters.dateTo + "T23:59:59")
        : true;

      const typeOk =
        filters.type === "All"
          ? true
          : (txn.transaction_type || "").toLowerCase() ===
            filters.type.toLowerCase();

      const searchValue = filters.search.toLowerCase();
      const searchOk = filters.search
        ? (txn.transaction_type || "").toLowerCase().includes(searchValue) ||
          (txn.description || "").toLowerCase().includes(searchValue) ||
          (txn.reference_no || "").toLowerCase().includes(searchValue)
        : true;

      return fromOk && toOk && typeOk && searchOk;
    });
  }, [allTransactions, filters]);

  const totalIncoming = filteredTransactions
    .filter((txn) => Number(txn.amount) > 0)
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const totalOutgoing = filteredTransactions
    .filter((txn) => Number(txn.amount) < 0)
    .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getTypeClass = (type) => {
    const value = (type || "").toLowerCase();

    if (value.includes("deposit")) return "txn-type deposit";
    if (value.includes("transfer received")) return "txn-type received";
    if (value.includes("transfer")) return "txn-type transfer";
    if (value.includes("bill")) return "txn-type bill";
    return "txn-type default";
  };

  const getStatusClass = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "completed") return "txn-status completed";
    if (value === "pending") return "txn-status pending";
    if (value === "failed") return "txn-status failed";
    return "txn-status default";
  };

  return (
    <main className="dashboard-main transaction-page">
      <section className="transactions-hero">
        <div className="transactions-hero-left">
          <span className="transactions-badge">Banking Records</span>
          <h2>Transaction History</h2>
          <p>
            Review all incoming and outgoing activity with filters, search, and
            status tracking.
          </p>
        </div>

        <div className="transactions-hero-right">
          <div className="transactions-stat-card">
            <span>Total Records</span>
            <strong>{filteredTransactions.length}</strong>
          </div>
          <div className="transactions-stat-card">
            <span>Total Incoming</span>
            <strong className="positive-text">
              ₱{totalIncoming.toLocaleString()}
            </strong>
          </div>
          <div className="transactions-stat-card">
            <span>Total Outgoing</span>
            <strong className="negative-text">
              ₱{totalOutgoing.toLocaleString()}
            </strong>
          </div>
        </div>
      </section>

      <section className="transactions-filter-panel">
        <div className="transactions-filter-header">
          <h3>Filter Transactions</h3>
        </div>

        <div className="transactions-filter-grid">
          <div className="transactions-form-group">
            <label>Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleChange}
            />
          </div>

          <div className="transactions-form-group">
            <label>Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleChange}
            />
          </div>

          <div className="transactions-form-group">
            <label>Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
            >
              <option value="All">All</option>
              <option value="Deposit">Deposit</option>
              <option value="Transfer">Transfer</option>
              <option value="Transfer Received">Transfer Received</option>
              <option value="Bill Payment">Bill Payment</option>
            </select>
          </div>

          <div className="transactions-form-group search-wide">
            <label>Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search reference, description, or type"
            />
          </div>
        </div>
      </section>

      <section className="transactions-table-panel">
        <div className="transactions-table-header">
          <h3>All Transactions</h3>
        </div>

        {loading ? (
          <div className="transactions-state">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="transactions-state">
            No transactions found for the selected filters.
          </div>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="amount-col">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.transaction_id}>
                    <td>
                      <div className="txn-ref">{txn.reference_no}</div>
                    </td>

                    <td>
                      <span className={getTypeClass(txn.transaction_type)}>
                        {txn.transaction_type}
                      </span>
                    </td>

                    <td>
                      <div className="txn-description">
                        {txn.description || "No description provided"}
                      </div>
                    </td>

                    <td>
                      <div className="txn-date">
                        {formatDate(txn.transaction_date)}
                      </div>
                    </td>

                    <td>
                      <span className={getStatusClass(txn.status)}>
                        {txn.status || "Unknown"}
                      </span>
                    </td>

                    <td className="amount-col">
                      <span
                        className={
                          Number(txn.amount) >= 0
                            ? "txn-amount positive"
                            : "txn-amount negative"
                        }
                      >
                        {Number(txn.amount) >= 0 ? "+" : "-"}₱
                        {Math.abs(Number(txn.amount)).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Transactions;