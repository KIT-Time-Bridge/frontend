import React, { useState, useRef, useEffect } from 'react';
import styles from './Searchbar.module.css';
import RegionSelector from './RegionSelector';

import { FaSearch } from "react-icons/fa";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

export default function Searchbar({ onSearch, searchFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [localFilters, setLocalFilters] = useState({
    gender_id: '',
    missing_birth: '',
    missing_date: '',
    missing_place: '',
  });
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

  // searchFilters가 외부에서 초기화되면 로컬 state도 초기화
  useEffect(() => {
    if (!searchFilters || Object.values(searchFilters).every(v => v === null || v === '')) {
      setLocalFilters({
        gender_id: '',
        missing_birth: '',
        missing_date: '',
        missing_place: '',
      });
      setNameSearch('');
    }
  }, [searchFilters]);

  const handleNameSearch = (e) => {
    const value = e.target.value;
    setNameSearch(value);
  };

  const handleLocalFilterChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value || '',
    }));
  };

  const handleSearch = () => {
    // 통합 검색: 이름 검색창의 값을 이름, 실종상황, 추가단서 모두에 적용
    const searchKeywords = nameSearch.trim();
    
    const filters = {
      search_keywords: searchKeywords || null, // 통합 검색 키워드
      gender_id: localFilters.gender_id || null,
      missing_birth: localFilters.missing_birth || null,
      missing_date: localFilters.missing_date || null,
      missing_place: localFilters.missing_place || null,
    };

    // 최소 하나의 필터가 있어야 함
    const hasAnyFilter = filters.search_keywords || filters.gender_id || filters.missing_birth || filters.missing_date || filters.missing_place;
    
    if (!hasAnyFilter) {
      alert('검색 조건을 최소 하나 이상 입력해주세요.');
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
        placeholder="이름, 실종상황, 추가단서로 검색 (띄어쓰기로 여러 키워드 검색 가능)..."
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
            <label className={styles.filterLabel}>성별</label>
            <select
              className={styles.filterInput}
              value={localFilters.gender_id}
              onChange={(e) => handleLocalFilterChange('gender_id', e.target.value)}
            >
              <option value="">선택 안 함</option>
              <option value="1">남</option>
              <option value="2">여</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>생년월일</label>
            <input
              type="date"
              className={styles.filterInput}
              value={localFilters.missing_birth}
              onChange={(e) => handleLocalFilterChange('missing_birth', e.target.value)}
            />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>실종일자</label>
            <input
              type="date"
              className={styles.filterInput}
              value={localFilters.missing_date}
              onChange={(e) => handleLocalFilterChange('missing_date', e.target.value)}
            />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>실종장소</label>
            <RegionSelector
              value={localFilters.missing_place}
              onChange={(value) => handleLocalFilterChange('missing_place', value)}
              className={styles.regionSelector}
            />
          </div>
        </div>
      )}
    </div>
  );
}
