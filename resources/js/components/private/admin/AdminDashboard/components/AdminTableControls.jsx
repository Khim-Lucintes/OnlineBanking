import React from "react";

function AdminTableControls({
  search,
  setSearch,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  sortOptions,
}) {
  return (
    <div className="admin-table-controls">
      <input
        type="text"
        className="admin-table-search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="admin-table-select"
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>

      <select
        className="admin-table-select"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

export default AdminTableControls;