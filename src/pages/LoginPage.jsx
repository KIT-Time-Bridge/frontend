import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios를 import 합니다.

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/login', {
        user_id: username,
        user_pw: password,
      });

      // 1. (변경)
      // try 블록에 왔다는 것 자체가 2xx 응답(성공)을 의미합니다.
      // 따라서 별도 if문 없이 바로 성공 처리를 합니다.
      console.log('로그인 성공:', response.data);
      alert('로그인에 성공했습니다.');
      navigate('/'); // 모든 사용자는 홈페이지로 이동

    } catch (error) {
      console.error('로그인 중 오류 발생:', error);

      // 2. (개선)
      // catch 블록에서 에러 유형을 구분해주는 것이 좋습니다.
      if (error.response) {
        // 서버가 응답을 했으나, 4xx (권한 없음, 잘못된 요청) 또는 5xx (서버 오류)인 경우
        console.log('로그인 실패 (서버 응답):', error.response.data);
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
      } else {
        // 요청 자체가 실패한 경우 (e.g., 네트워크 오류, 서버 다운)
        alert('로그인 중 오류가 발생했습니다. 서버 상태를 확인해 주세요.');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h2 className={styles.formTitle}>로그인</h2>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>아이디</label>
          <input
            type="text"
            id="username"
            className={styles.formInput}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>비밀번호</label>
          <input
            type="password"
            id="password"
            className={styles.formInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formLinks}>
          <Link to="/register" className={styles.link}>회원가입</Link>
          <Link to="/" className={styles.link}>아이디/비밀번호 찾기</Link>
        </div>
        <button type="submit" className="btn-mint">로그인</button>
      </form>
    </div>
  );
}