// Footer.js

import styles from './Footer.module.css'
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Time Bridge 설명 컬럼 */}

        <div className={styles.infoContainer}>
            <div className={styles.column + ' ' + styles.infoColumn}>
                <h4>Time Bridge</h4>
                <p>
                    Time Bridge는 생성형 이미지 기술을 활용하여 실종 당시의 사진을 나이 변환해 현재의 모습으로 재현합니다.
                </p>
            </div>

            {/* 주의사항 컬럼 */}
            <div className={styles.column + ' ' + styles.infoColumn}>
                <h4>주의사항</h4>
                <p>
                    본 사이트에서 생성된 이미지는 정보를 제공 또는 조회하는 용도이며, 공식적인 수사 자료로 활용될 수 없습니다.
                </p>
            </div>
        </div>

        {/* 문의 컬럼 (고정) */}
        <div className={styles.column + ' ' + styles.contactColumn}>
          <h4>문의</h4>
          <p>wsong22@naver.com</p>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; 2024 Time Bridge. All Rights Reserved.</p>
      </div>
    </footer>
  );
}