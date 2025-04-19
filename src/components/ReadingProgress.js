import React, { useState } from 'react';

const ReadingProgress = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <div className="reading-progress" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <h2>Reading Progress</h2>
      <div>
        <input
          type="number"
          placeholder="Current Page"
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Total Pages"
          value={totalPages}
          onChange={(e) => setTotalPages(Number(e.target.value))}
        />
      </div>
      {totalPages > 0 && (
        <div>
          Progress: {Math.round((currentPage / totalPages) * 100)}%
        </div>
      )}
    </div>
  );
};

export default ReadingProgress;
