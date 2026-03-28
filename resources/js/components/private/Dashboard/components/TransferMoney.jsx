import React, { useEffect, useState } from "react";

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
        console.log("Transfer API error:", data);
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
      console.error("Transfer request:", err);
      showToast("error", "Server error. Please try again.");
    }
  };

  return (
    <main className="dashboard-main">
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <section className="dashboard-panel page-hero-panel">
        <div className="page-hero-content">
          <div>
            <span className="page-badge">Transfer Center</span>
            <div className="panel-header panel-header-no-margin">
              <h3>Transfer Money</h3>
            </div>
            <p className="section-description">
              Send money using your real account data from MySQL.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>New Transfer</h3>
          </div>

          <form className="dashboard-form" onSubmit={handleTransfer}>
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
                <p>
                  Recipient Name: <strong>{recipientInfo.username}</strong>
                </p>
                <p>
                  Account Type: <strong>{recipientInfo.account_type}</strong>
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

            <button type="submit" className="form-action-btn">
              Confirm Transfer
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

export default TransferMoney;