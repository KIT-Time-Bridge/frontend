import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { RiUserSearchFill } from "react-icons/ri";
import { MdFamilyRestroom } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/users/status');
        setIsLoggedIn(response.data);
      } catch (error) {
        console.error('로그인 상태 확인 오류:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
    }
  };

  // 1. '매칭 조회' 클릭 핸들러 함수
  const handleMatchingClick = (e) => {
    // 2. <Link>의 기본 동작(즉시 페이지 이동)을 막습니다.
    e.preventDefault(); 
    
    // 3. useEffect에서 이미 가져온 로그인 state를 확인합니다. (API 재호출 불필요)
    if (isLoggedIn) {
      // 4. 로그인 상태면 '/face-similarity'로 이동시킵니다.
      navigate('/face-similarity');
    } else {
      // 5. 비로그인 상태면 경고창을 띄웁니다.
      alert('로그인이 필요한 기능입니다.');
    }
  };

  return (
    <div className={styles.navbar}>
      <Link className={styles.navLogo} to="/"><h2>TimeBridge</h2></Link>

      <div className={styles.navMenuGroup}>
          <Link className={styles.navMenu} to="/missing"><RiUserSearchFill className={styles.navIcon}/>실종자 찾기</Link>
          <Link className={styles.navMenu} to="/family"><MdFamilyRestroom className={styles.navIcon}/>가족 찾기</Link>
          {/* 6. '매칭 조회' <Link>에 onClick 이벤트 핸들러를 연결합니다. */}
          <Link 
            className={styles.navMenu} 
            to="/face-similarity" 
            onClick={handleMatchingClick}
          >
            <FaHandshake className={styles.navIcon}/>매칭 조회
          </Link>
      </div>

      <div className={styles.navBtnGroup}>
        {isLoggedIn ? (
          <button className='btn-white' onClick={handleLogout}>로그아웃</button>
        ) : (
          <>
            <Link className='btn-mint' to="/login">로그인</Link>
            <Link className='btn-white' to="/register">회원가입</Link>
          </>
        )}
      </div>
    </div>
  );
}