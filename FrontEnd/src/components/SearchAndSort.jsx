import React from "react";

const SearchAndSort = ({ query, setQuery, sortBy, setSortBy }) => {
  return (
    <div className="search-sort-container">
      <input
        type="search"
        placeholder="Search games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
        <option value="relevance">Relevance</option>
        <option value="name-asc">Name A–Z</option>
        <option value="name-desc">Name Z–A</option>
        <option value="rating-desc">Rating High → Low</option>
        <option value="released-desc">Newest</option>
        <option value="released-asc">Oldest</option>
      </select>
    </div>
  );
};

export default SearchAndSort;
