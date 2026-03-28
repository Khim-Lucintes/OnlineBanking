import React from "react";
import { useEffect, useState } from "react";

function PayBills({ dashboardData, refreshDashboard }) {
  const accounts = dashboardData?.accounts || [];
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    account_id: accounts[0]?.account_id || "",
    bill_id: "",
    amount: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("/api/bills", {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setBills(data);
          if (data.length > 0) {
            setForm((prev) => ({ ...prev, bill_id: data[0].bill_id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch bills", err);
      }
    };

    fetchBills();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/pay-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Bill payment failed");
        return;
      }

      setMessage(data.message);
      setForm({
        account_id: accounts[0]?.account_id || "",
        bill_id: bills[0]?.bill_id || "",
        amount: "",
      });

      await refreshDashboard();
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <main className="dashboard-main">
      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Bills Payment</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Pay Bills</h3>
            </div>
            <p className="section-description">
              Pay bills using your real account balance and store the payment in MySQL.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>New Bill Payment</h3>
          </div>

          {message && <p style={{ color: "#63f0b1" }}>{message}</p>}
          {error && <p style={{ color: "#ff7b7b" }}>{error}</p>}

          <form className="dashboard-form" onSubmit={handlePayBill}>
            <div className="form-group">
              <label>From Account</label>
              <select
                name="account_id"
                value={form.account_id}
                onChange={handleChange}
              >
                {accounts.map((account) => (
                  <option key={account.account_id} value={account.account_id}>
                    {account.account_type} - {account.account_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Biller</label>
              <select
                name="bill_id"
                value={form.bill_id}
                onChange={handleChange}
              >
                {bills.map((bill) => (
                  <option key={bill.bill_id} value={bill.bill_id}>
                    {bill.biller_name} ({bill.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
              />
            </div>

            <button type="submit" className="form-action-btn">
              Confirm Payment
            </button>
          </form>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Available Accounts</h3>
          </div>

          <div className="summary-list">
            {accounts.map((account) => (
              <div className="summary-item" key={account.account_id}>
                <span>{account.account_number}</span>
                <strong>₱{Number(account.balance).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PayBills;