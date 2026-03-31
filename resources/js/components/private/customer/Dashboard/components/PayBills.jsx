import React from "react";
import { useEffect, useState } from "react";
import "../../../../../../css/DashboardPage/components/PayBills.css";

function PayBills({ dashboardData, refreshDashboard }) {
  const accounts = dashboardData?.accounts || [];

  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    account_id: "",
    bill_id: "",
    amount: "",
  });

  const [selectedBill, setSelectedBill] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (accounts.length > 0) {
      setForm((prev) => ({
        ...prev,
        account_id: prev.account_id || accounts[0].account_id,
      }));
    }
  }, [accounts]);

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
            setForm((prev) => ({
              ...prev,
              bill_id: prev.bill_id || String(data[0].bill_id),
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch bills", error);
      }
    };

    fetchBills();
  }, []);

  useEffect(() => {
    const foundBill = bills.find(
      (bill) => String(bill.bill_id) === String(form.bill_id)
    );
    setSelectedBill(foundBill || null);
  }, [form.bill_id, bills]);

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayBill = async (e) => {
    e.preventDefault();

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
        showToast("error", data.error || data.message || "Bill payment failed");
        return;
      }

      showToast("success", data.message || "Bill payment completed successfully");

      setForm({
        account_id: accounts[0]?.account_id || "",
        bill_id: bills[0]?.bill_id ? String(bills[0].bill_id) : "",
        amount: "",
      });

      if (refreshDashboard) {
        await refreshDashboard();
      }
    } catch (error) {
      showToast("error", "Server error. Please try again.");
    }
  };

  const selectedAccount = accounts.find(
    (acc) => String(acc.account_id) === String(form.account_id)
  );

  const formatAmount = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  return (
    <main className="dashboard-main paybills-page">
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <section className="paybills-hero">
        <div className="paybills-hero-left">
          <span className="paybills-badge">Bills Payment Center</span>
          <h2>Pay your bills securely and on time</h2>
          <p>
            Manage utility, internet, telecom, and credit card payments with a
            professional and secure banking experience.
          </p>
        </div>

        <div className="paybills-hero-right">
          <div className="paybills-balance-card">
            <span>Available Balance</span>
            <h1>{formatAmount(selectedAccount?.balance)}</h1>
            <p>{selectedAccount?.account_number || "No account selected"}</p>
          </div>
        </div>
      </section>

      <section className="paybills-summary-grid">
        <div className="paybills-stat-card highlight">
          <span>Source Account</span>
          <h3>{selectedAccount?.account_type || "Savings"} Account</h3>
          <p>{selectedAccount?.account_number || "N/A"}</p>
        </div>

        <div className="paybills-stat-card">
          <span>Selected Biller</span>
          <h3>{selectedBill?.biller_name || "Waiting..."}</h3>
          <p>{selectedBill?.category || "Choose a biller"}</p>
        </div>

        <div className="paybills-stat-card">
          <span>Payment Amount</span>
          <h3>{form.amount ? formatAmount(form.amount) : "₱0"}</h3>
          <p>Live payment preview</p>
        </div>

        <div className="paybills-stat-card">
          <span>Available Billers</span>
          <h3>{bills.length}</h3>
          <p>Ready for payment</p>
        </div>
      </section>

      <section className="paybills-grid">
        <div className="dashboard-panel paybills-panel">
          <div className="panel-header">
            <div>
              <h3>New Bill Payment</h3>
              <span className="panel-subtitle">
                Complete the payment details below
              </span>
            </div>
          </div>

          <form className="paybills-form" onSubmit={handlePayBill}>
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

            {selectedBill && (
              <div className="biller-preview">
                <div className="biller-preview-top">
                  <span className="biller-chip">Verified Biller</span>
                </div>
                <p>
                  Biller Name: <strong>{selectedBill.biller_name}</strong>
                </p>
                <p>
                  Category: <strong>{selectedBill.category}</strong>
                </p>
              </div>
            )}

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
                min="1"
                step="0.01"
              />
            </div>

            <button type="submit" className="paybills-submit-btn">
              Confirm Payment
            </button>
          </form>
        </div>

        <div className="dashboard-panel paybills-side-panel">
          <div className="panel-header">
            <div>
              <h3>Available Billers</h3>
              <span className="panel-subtitle">Supported payment partners</span>
            </div>
          </div>

          <div className="billers-list">
            {bills.map((bill) => (
              <div className="biller-item" key={bill.bill_id}>
                <h4>{bill.biller_name}</h4>
                <p>{bill.category}</p>
              </div>
            ))}
          </div>

          <div className="paybills-note-box">
            <p>
              Always review the selected biller and payment amount before
              confirming to avoid incorrect bill payments.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PayBills;