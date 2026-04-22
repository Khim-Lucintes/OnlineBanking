import React from "react";

function AdminModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default AdminModal;