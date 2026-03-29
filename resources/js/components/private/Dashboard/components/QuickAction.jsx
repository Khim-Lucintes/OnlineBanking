import React from "react";

function QuickAction({ setActivePage }) {
  const actions = [
    { label: "Transfer Money", page: "transfer" },
    { label: "Pay Bills", page: "paybills" },
    { label: "View Transactions", page: "transactions" },
    { label: "Profile Settings", page: "profile" },
  ];

  return (
    <div className="quick-action-grid">
      {actions.map((action) => (
        <button
          key={action.page}
          type="button"
          className="quick-action-btn"
          onClick={() => setActivePage(action.page)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default QuickAction;