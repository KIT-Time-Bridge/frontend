import styles from './Pagination.module.css'
import { Link } from 'react-router-dom';

import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";

export default function Pagination({ startPage, endPage, currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const isFirstGroup = startPage === 1;
    const isLastGroup = endPage >= totalPages;

    const handlePrevGroupClick = () => {
        if (!isFirstGroup) {
            onPageChange(startPage - 1);
        }
    };

    const handleNextGroupClick = () => {
        if (!isLastGroup) {
            onPageChange(endPage + 1);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button
                className='btn-white'
                onClick={handlePrevGroupClick}
            >
                <MdNavigateBefore className={styles.icon} />
            </button>

            {pageNumbers.map(page => (
                <button
                    key={page}
                    className={page === currentPage ? 'btn-mint' : 'btn-white'}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className='btn-white'
                onClick={handleNextGroupClick}
            >
                <MdNavigateNext className={styles.icon} />
            </button>
        </div>
    );
}