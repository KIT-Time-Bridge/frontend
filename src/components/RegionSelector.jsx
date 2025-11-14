import React, { useState, useEffect } from 'react';
import { simplifiedRegions } from '../utils/koreaRegions';
import styles from './RegionSelector.module.css';

export default function RegionSelector({ value, onChange, className }) {
  const [selectedDo, setSelectedDo] = useState('');
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedDong, setSelectedDong] = useState('');

  // value가 변경되면 파싱하여 각 선택값 설정
  useEffect(() => {
    if (value) {
      const parts = value.split(' ').filter(p => p);
      if (parts.length >= 1) {
        setSelectedDo(parts[0] || '');
        if (parts.length >= 2) {
          setSelectedSi(parts[1] || '');
          if (parts.length >= 3) {
            setSelectedDong(parts[2] || '');
          }
        }
      }
    } else {
      setSelectedDo('');
      setSelectedSi('');
      setSelectedDong('');
    }
  }, [value]);

  const handleDoChange = (e) => {
    const doValue = e.target.value;
    setSelectedDo(doValue);
    setSelectedSi('');
    setSelectedDong('');
    if (onChange) {
      onChange(doValue ? `${doValue}` : '');
    }
  };

  const handleSiChange = (e) => {
    const siValue = e.target.value;
    setSelectedSi(siValue);
    setSelectedDong('');
    if (onChange) {
      const place = selectedDo ? `${selectedDo} ${siValue}` : siValue;
      onChange(place);
    }
  };

  const handleDongChange = (e) => {
    const dongValue = e.target.value;
    setSelectedDong(dongValue);
    if (onChange) {
      const place = selectedDo && selectedSi 
        ? `${selectedDo} ${selectedSi} ${dongValue}` 
        : selectedDo 
          ? `${selectedDo} ${dongValue}` 
          : dongValue;
      onChange(place);
    }
  };

  const doList = Object.keys(simplifiedRegions);
  const siList = selectedDo && simplifiedRegions[selectedDo] ? Object.keys(simplifiedRegions[selectedDo]) : [];
  const dongList = selectedDo && selectedSi && simplifiedRegions[selectedDo] && simplifiedRegions[selectedDo][selectedSi] 
    ? simplifiedRegions[selectedDo][selectedSi] 
    : [];

  return (
    <div className={`${styles.regionSelector} ${className || ''}`}>
      <select
        value={selectedDo}
        onChange={handleDoChange}
        className={styles.select}
      >
        <option value="">도/시 선택</option>
        {doList.map(do => (
          <option key={do} value={do}>{do}</option>
        ))}
      </select>
      <select
        value={selectedSi}
        onChange={handleSiChange}
        className={styles.select}
        disabled={!selectedDo}
      >
        <option value="">군/구 선택</option>
        {siList.map(si => (
          <option key={si} value={si}>{si}</option>
        ))}
      </select>
      <select
        value={selectedDong}
        onChange={handleDongChange}
        className={styles.select}
        disabled={!selectedSi}
      >
        <option value="">읍/면/동 선택</option>
        {dongList.map(dong => (
          <option key={dong} value={dong}>{dong}</option>
        ))}
      </select>
    </div>
  );
}

