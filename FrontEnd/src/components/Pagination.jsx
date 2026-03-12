import React from "react";

const Pagination = ({ hasMore, onLoadMore, onReset }) => {
  return (
    <div className="pagination-container">
      {hasMore ? (
        <button onClick={onLoadMore} className="pill-button primary">
          Load more
        </button>
      ) : (
        <button onClick={onReset} className="pill-button secondary">
          Reset
        </button>
      )}
    </div>
  );
};

export default Pagination;
