import React from "react";

function AdminPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="admin-pagination">
      <button
        className="admin-btn secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        Prev
      </button>

      <span className="admin-pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="admin-btn secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Next
      </button>
    </div>
  );
}

export default AdminPagination;