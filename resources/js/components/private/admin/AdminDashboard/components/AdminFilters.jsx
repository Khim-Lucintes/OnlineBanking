import React from "react";

function AdminFilters({
  search,
  setSearch,
  filters = [],
  values = {},
  onChange,
  onClear,
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

      {filters.map((filter) => (
        <select
          key={filter.name}
          className="admin-table-select"
          name={filter.name}
          value={values[filter.name] || ""}
          onChange={onChange}
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      <button type="button" className="admin-btn secondary" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}

export default AdminFilters;