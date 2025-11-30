import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { RiUserSearchFill } from "react-icons/ri";
import { MdFamilyRestroom } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/users/status', {
          withCredentials: true
        });
        setIsLoggedIn(response.data);
        
        // 로그인 상태인 경우 관리자 여부 확인
        if (response.data) {
          try {
            const adminCheck = await axios.get('/api/users/is_admin', {
              withCredentials: true
            });
            setIsAdmin(adminCheck.data.is_admin || false);
          } catch (adminError) {
            console.error('관리자 확인 오류:', adminError);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('로그인 상태 확인 오류:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, {
        withCredentials: true
      });
      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
    }
  };

  // 이미지 매칭 조회 클릭 핸들러 함수
  const handleImageMatchingClick = (e) => {
    e.preventDefault(); 
    if (isLoggedIn) {
      navigate('/face-similarity');
    } else {
      alert('로그인이 필요한 기능입니다.');
    }
  };

  // 텍스트 매칭 조회 클릭 핸들러 함수
  const handleTextMatchingClick = (e) => {
    e.preventDefault(); 
    if (isLoggedIn) {
      navigate('/multimodal-search');
    } else {
      alert('로그인이 필요한 기능입니다.');
    }
  };

  return (
    <div className={styles.navbar}>
      <Link className={styles.navLogo} to="/"><h2>TimeBridge</h2></Link>

      <div className={styles.navMenuGroup}>
          <Link className={styles.navMenu} to="/missing"><RiUserSearchFill className={styles.navIcon}/>실종자 찾기</Link>
          <Link className={styles.navMenu} to="/family"><MdFamilyRestroom className={styles.navIcon}/>가족 찾기</Link>
          {/* 이미지 기반 매칭 조회 */}
          <Link 
            className={styles.navMenu} 
            to="/face-similarity" 
            onClick={handleImageMatchingClick}
          >
            <FaHandshake className={styles.navIcon}/>이미지 매칭 조회
          </Link>
          {/* 텍스트 기반 매칭 조회 */}
          <Link 
            className={styles.navMenu} 
            to="/multimodal-search" 
            onClick={handleTextMatchingClick}
          >
            <FaHandshake className={styles.navIcon}/>텍스트 매칭 조회
          </Link>
      </div>

      <div className={styles.navBtnGroup}>
        {isLoggedIn ? (
          <>
            <Link className='btn-white' to="/mypage">마이페이지</Link>
            {isAdmin && (
              <Link className='btn-mint' to="/admin">관리자 페이지</Link>
            )}
            <button className='btn-white' onClick={handleLogout}>로그아웃</button>
          </>
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