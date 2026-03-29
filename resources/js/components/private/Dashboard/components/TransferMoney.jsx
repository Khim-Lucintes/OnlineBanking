import React, { useEffect, useState } from "react";
import "../../../../../css/DashboardPage/components/TransferMoney.css";

function TransferMoney({ dashboardData, refreshDashboard }) {
  const accounts = dashboardData?.accounts || [];

  const [form, setForm] = useState({
    from_account_id: "",
    to_account: "",
    amount: "",
    remarks: "",
  });

  const [recipientInfo, setRecipientInfo] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (accounts.length > 0) {
      setForm((prev) => ({
        ...prev,
        from_account_id: prev.from_account_id || accounts[0].account_id,
      }));
    }
  }, [accounts]);

  useEffect(() => {
    const lookupRecipient = async () => {
      if (!form.to_account || form.to_account.trim().length < 5) {
        setRecipientInfo(null);
        return;
      }

      try {
        const response = await fetch(
          `/api/recipient/${encodeURIComponent(form.to_account.trim())}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setRecipientInfo(data.recipient);
        } else {
          setRecipientInfo(null);
        }
      } catch (error) {
        setRecipientInfo(null);
      }
    };

    const timer = setTimeout(() => {
      lookupRecipient();
    }, 400);

    return () => clearTimeout(timer);
  }, [form.to_account]);

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

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/transfer-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.error || data.message || "Transfer failed");
        return;
      }

      showToast("success", data.message || "Transfer completed successfully");

      setForm({
        from_account_id: accounts[0]?.account_id || "",
        to_account: "",
        amount: "",
        remarks: "",
      });

      setRecipientInfo(null);

      if (refreshDashboard) {
        await refreshDashboard();
      }
    } catch (err) {
      showToast("error", "Server error. Please try again.");
    }
  };

  const selectedAccount = accounts.find(
    (acc) => String(acc.account_id) === String(form.from_account_id)
  );

  const formatAmount = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  return (
    <main className="dashboard-main transfer-page">
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <section className="transfer-hero">
        <div className="transfer-hero-left">
          <span className="transfer-badge">Secure Transfer Center</span>
          <h2>Send funds with confidence</h2>
          <p>
            Transfer money between accounts securely and review the recipient
            details before confirming the transaction.
          </p>
        </div>

        <div className="transfer-hero-right">
          <div className="transfer-balance-card">
            <span>Available Balance</span>
            <h1>{formatAmount(selectedAccount?.balance)}</h1>
            <p>{selectedAccount?.account_number || "No account selected"}</p>
          </div>
        </div>
      </section>

      <section className="transfer-summary-grid">
        <div className="transfer-stat-card highlight">
          <span>From Account</span>
          <h3>{selectedAccount?.account_type || "Savings"} Account</h3>
          <p>{selectedAccount?.account_number || "N/A"}</p>
        </div>

        <div className="transfer-stat-card">
          <span>Status</span>
          <h3>{selectedAccount?.status || "Active"}</h3>
          <p>Current source account state</p>
        </div>

        <div className="transfer-stat-card">
          <span>Recipient Lookup</span>
          <h3>{recipientInfo?.username || "Waiting..."}</h3>
          <p>{recipientInfo?.account_type || "Enter account number"}</p>
        </div>

        <div className="transfer-stat-card">
          <span>Transfer Amount</span>
          <h3>{form.amount ? formatAmount(form.amount) : "₱0"}</h3>
          <p>Live transfer preview</p>
        </div>
      </section>

      <section className="transfer-grid">
        <div className="dashboard-panel transfer-panel">
          <div className="panel-header">
            <div>
              <h3>New Transfer</h3>
              <span className="panel-subtitle">
                Complete the details below
              </span>
            </div>
          </div>

          <form className="transfer-form" onSubmit={handleTransfer}>
            <div className="form-group">
              <label>From Account</label>
              <select
                name="from_account_id"
                value={form.from_account_id}
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
              <label>Recipient Account Number</label>
              <input
                type="text"
                name="to_account"
                value={form.to_account}
                onChange={handleChange}
                placeholder="Enter recipient account number"
              />
            </div>

            {recipientInfo && (
              <div className="recipient-preview">
                <div className="recipient-preview-top">
                  <span className="recipient-chip">Verified Recipient</span>
                </div>
                <p>
                  Recipient Name: <strong>{recipientInfo.username}</strong>
                </p>
                <p>
                  Account Type: <strong>{recipientInfo.account_type}</strong>
                </p>
                <p>
                  Account Number: <strong>{recipientInfo.account_number}</strong>
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
                placeholder="Enter amount"
                min="1"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Optional note"
              />
            </div>

            <button type="submit" className="transfer-submit-btn">
              Confirm Transfer
            </button>
          </form>
        </div>

        <div className="dashboard-panel transfer-side-panel">
          <div className="panel-header">
            <div>
              <h3>Available Accounts</h3>
              <span className="panel-subtitle">Choose a source account</span>
            </div>
          </div>

          <div className="transfer-account-list">
            {accounts.map((account) => (
              <div className="transfer-account-item" key={account.account_id}>
                <div className="transfer-account-info">
                  <h4>{account.account_type} Account</h4>
                  <p>{account.account_number}</p>
                </div>
                <div className="transfer-account-amount">
                  <strong>{formatAmount(account.balance)}</strong>
                  <span>{account.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="transfer-note-box">
            <p>
              Double-check the recipient account number before confirming the
              transaction to avoid sending funds to the wrong account.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TransferMoney;