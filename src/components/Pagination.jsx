import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage = 0, totalPages = 1, onPageChange = () => { } }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const showPrevious = currentPage > 0;
    const showNext = currentPage < totalPages - 1;

    return (
        <div className="pagination-container">
            <div className="pagination-wrapper">
                {/* Previous Button */}
                <button
                    className={`pagination-btn pagination-prev ${!showPrevious ? 'disabled' : ''}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!showPrevious}
                >
                    ← Previous
                </button>

                {/* Page Numbers */}
                <div className="pagination-numbers">
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page + 1}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    className={`pagination-btn pagination-next ${!showNext ? 'disabled' : ''}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!showNext}
                >
                    Next →
                </button>
            </div>

            {/* Page Info */}
            <div className="pagination-info">
                Page {currentPage + 1} of {totalPages}
            </div>
        </div>
    );
};

export default Pagination;
