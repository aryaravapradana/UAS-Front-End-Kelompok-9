'use client';

import React from 'react';
import styles from './PaginationControls.module.css';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
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
        Page {currentPage} of {totalPages}
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
