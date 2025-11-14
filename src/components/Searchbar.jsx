import React, { useState, useRef, useEffect } from 'react';
import styles from './Searchbar.module.css';

import { FaSearch } from "react-icons/fa";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

export default function Searchbar({ onSearch, searchFilters, onFilterChange }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleNameSearch = (e) => {
    const value = e.target.value;
    setNameSearch(value);
  };

  const handleFilterChange = (field, value) => {
    if (onFilterChange) {
      const newFilters = {
        ...searchFilters,
        [field]: value || null,
      };
      onFilterChange(newFilters);
    }
  };

  const handleSearch = () => {
    const filters = {
      missing_name: nameSearch || null,
      missing_situation: searchFilters?.missing_situation || null,
      missing_extra_evidence: searchFilters?.missing_extra_evidence || null,
    };

    // 최소 하나의 필터가 있어야 함
    const hasAnyFilter = filters.missing_name || filters.missing_situation || filters.missing_extra_evidence;
    
    if (!hasAnyFilter) {
      alert('이름, 실종상황, 추가단서 중 최소 하나는 입력해주세요.');
      return;
    }

    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchbarContainer}>
      <input 
        type="text" 
        className={styles.searchInput}
        placeholder="이름으로 검색..."
        value={nameSearch}
        onChange={handleNameSearch}
        onKeyPress={handleKeyPress}
      />
      <button 
        type="button"
        className={styles.filterButton}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        aria-label="세부 검색"
      >
        {isFilterOpen ? (
          <GoTriangleUp className={styles.filterIcon} />
        ) : (
          <GoTriangleDown className={styles.filterIcon} />
        )}
      </button>
      <button 
        type="button"
        className={styles.searchButton}
        onClick={handleSearch}
        aria-label="검색"
      >
        <FaSearch className={styles.searchIcon} />
      </button>
      
      {isFilterOpen && (
        <div className={styles.filterMenu} ref={filterRef}>
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>실종 상황</label>
            <input
              type="text"
              className={styles.filterInput}
              placeholder="실종 상황 키워드 입력..."
              value={searchFilters?.missing_situation || ''}
              onChange={(e) => handleFilterChange('missing_situation', e.target.value)}
            />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>추가 단서</label>
            <input
              type="text"
              className={styles.filterInput}
              placeholder="추가 단서 키워드 입력..."
              value={searchFilters?.missing_extra_evidence || ''}
              onChange={(e) => handleFilterChange('missing_extra_evidence', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
