'use client';

import React, { useState, useEffect } from 'react';
import styles from './PaginationControls.module.css';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState(currentPage);

  // Sync input with external page changes
  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  if (totalPages <= 1) {
    return null; // Don't render controls if there's only one page
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    } else {
      // Reset input to current page if invalid
      setPageInput(currentPage);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        &larr; Previous
      </button>

      <span className={styles.pageInfo}>
        Page
        <input
          type="number"
          value={pageInput}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onBlur={handleGoToPage} // Trigger on blur as well
          className={styles.pageInput}
          min="1"
          max={totalPages}
        />
        of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default PaginationControls;
