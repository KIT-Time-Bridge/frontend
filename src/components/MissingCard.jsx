import styles from './MissingCard.module.css'
import { Link } from 'react-router-dom';

export default function MissingCard({ id, originalImage, name, gender, birth, place, date }) {
  if (!id) {
    console.error('MissingCard: id prop이 없습니다!');
    return null;
  }

  const handleClick = (e) => {
    console.log('MissingCard clicked, id:', id);
    // Link의 기본 동작을 막지 않음
  };

  return (
    <Link to={`/missing/${id}`} className={styles.cardLink} onClick={handleClick}>
      <div className={styles.cardContainer}>
          <div className={styles.cardImageGroup}>
              <p className={styles.cardNameText}>{name} ({gender})</p>
              <img src={originalImage || '/no-image.jpg'} className={styles.cardImage} alt={`${name} 사진`} />
          </div>
          <div className={styles.cardTextGroup}>
              <div className={styles.keyTextGroup}>
                  <p className={styles.cardKeyText}>생년월일</p>
                  <p className={styles.cardKeyText}>실종장소</p>
                  <p className={styles.cardKeyText}>실종날짜</p>
              </div>
              <div className={styles.valueTextGroup}>
                  <p className={styles.cardValueText}>{birth}</p>
                  <p className={styles.cardValueText}>{place}</p>
                  <p className={styles.cardValueText}>{date}</p>
              </div>
          </div>
      </div>
    </Link>
  );
}