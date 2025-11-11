import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios를 import 합니다.

import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => { // 함수명을 의미에 맞게 변경
    e.preventDefault();

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('/api/users/createuser', {
        name: name,
        email: email,
        password: password,
        username: username,
        birth: birth,
      });

      if (response.data === true) {
        alert('회원가입이 성공적으로 완료되었습니다.');
        navigate('/login');
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('회원가입 중 오류가 발생했습니다. 서버 상태를 확인해 주세요.');
    }
  };

  const isFormValid = username && email && name && birth && password && passwordCheck && password === passwordCheck;

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleRegister} className={styles.registerForm}>
        <h2 className={styles.formTitle}>회원가입</h2>
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
          <label htmlFor="email" className={styles.formLabel}>이메일</label>
          <input
            type="email"
            id="email"
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>이름</label>
          <input
            type="text"
            id="name"
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="birth" className={styles.formLabel}>생년월일</label>
          <input
            type="date"
            id="birth"
            className={styles.formInput}
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
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
        <div className={styles.formGroup}>
          <label htmlFor="passwordCheck" className={styles.formLabel}>비밀번호 확인</label>
          <input
            type="password"
            id="passwordCheck"
            className={styles.formInput}
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
        </div>
        <div className={styles.formLinks}>
          <Link to="/login" className={styles.link}>로그인</Link>
        </div>
        <button type="submit" className="btn-mint" disabled={!isFormValid}>회원가입</button>
      </form>
    </div>
  );
}