import React, { useEffect, useMemo, useState } from "react";
import "../../../../../css/DashboardPage/components/Transactions.css";

function Transactions({ dashboardData }) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: "All",
    amount: "",
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

      const amountOk = filters.amount
        ? String(txn.amount).includes(filters.amount)
        : true;

      const searchValue = filters.search.toLowerCase();
      const searchOk = filters.search
        ? (txn.transaction_type || "").toLowerCase().includes(searchValue) ||
          (txn.description || "").toLowerCase().includes(searchValue) ||
          (txn.reference_no || "").toLowerCase().includes(searchValue)
        : true;

      return fromOk && toOk && typeOk && amountOk && searchOk;
    });
  }, [allTransactions, filters]);

  const totalIncoming = filteredTransactions
    .filter((txn) => Number(txn.amount) > 0)
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const totalOutgoing = filteredTransactions
    .filter((txn) => Number(txn.amount) < 0)
    .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);

  return (
  <main className="dashboard-main transaction-page">

    {/* HERO + SUMMARY */}
    <section className="dashboard-panel">
      <div className="page-hero-content">
        <div>
          <span className="page-badge">Transaction Records</span>
          <div className="panel-header panel-header-no-margin">
            <h3>Full Transaction History</h3>
          </div>
          <p className="section-description">
            View all real transactions from MySQL and filter them by date,
            type, amount, or keyword.
          </p>
        </div>

        <div className="hero-summary-box">
          <p>Total Records</p>
          <h2>{filteredTransactions.length}</h2>
          <span>Filtered transaction results</span>
        </div>
      </div>
    </section>

    {/* CARDS */}
    <section className="dashboard-cards">
      <div className="small-card">
        <p>Total Incoming</p>
        <h3>₱{totalIncoming.toLocaleString()}</h3>
        <span>Positive transactions</span>
      </div>

      <div className="small-card">
        <p>Total Outgoing</p>
        <h3>₱{totalOutgoing.toLocaleString()}</h3>
        <span>Negative transactions</span>
      </div>

      <div className="small-card">
        <p>Transaction Types</p>
        <h3>
          {
            [...new Set(allTransactions.map((txn) => txn.transaction_type))]
              .filter(Boolean).length
          }
        </h3>
        <span>Unique types found</span>
      </div>

      <div className="small-card">
        <p>Customer</p>
        <h3>{user.username || "Customer"}</h3>
        <span>{user.email || "-"}</span>
      </div>
    </section>

    {/* FILTER PANEL (SEPARATE) */}
    <section className="dashboard-panel transactions-filter-panel">
      <div className="panel-header">
        <h3>Filter Transactions</h3>
      </div>

      <div className="filter-grid transaction-filter-grid">
        <div className="form-group">
          <label>Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
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

        <div className="form-group">
          <label>Amount Contains</label>
          <input
            type="text"
            name="amount"
            value={filters.amount}
            onChange={handleChange}
            placeholder="e.g. 2500"
          />
        </div>

        <div className="form-group filter-search-wide">
          <label>Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search type, description, reference no"
          />
        </div>
      </div>
    </section>

    {/* TRANSACTION HISTORY PANEL */}
    <section className="dashboard-panel transactions-history-panel">
      <div className="panel-header">
        <h3>Transaction History</h3>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : filteredTransactions.length > 0 ? (
        <div className="transaction-list full-transaction-list">
          {filteredTransactions.map((txn) => (
            <div className="transaction-item transaction-card" key={txn.transaction_id}>
              <div className="transaction-main-info">
                <h4>{txn.transaction_type}</h4>
                <p>{txn.description || "No description provided"}</p>

                <div className="transaction-meta">
                  <span>Ref: {txn.reference_no}</span>
                  <span>Date: {txn.transaction_date}</span>
                  <span>Status: {txn.status}</span>
                  <span>Account ID: {txn.account_id}</span>
                </div>
              </div>

              <span
                className={Number(txn.amount) >= 0 ? "positive" : "negative"}
              >
                ₱{Math.abs(Number(txn.amount)).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No transactions found for the selected filters.</p>
      )}
    </section>

  </main>
);
}

export default Transactions;