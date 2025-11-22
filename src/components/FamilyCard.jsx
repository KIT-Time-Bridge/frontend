import styles from './FamilyCard.module.css'
import { Link } from 'react-router-dom';

export default function FamilyCard({ id, originalImage, genImage, name, gender, birth, place, date }) {
  if (!id) {
    console.error('FamilyCard: id prop이 없습니다!');
    return null;
  }

  const handleClick = (e) => {
    console.log('FamilyCard clicked, id:', id);
  };

  return (
    <Link to={`/family/${id}`} className={styles.cardLink} onClick={handleClick}>
      <div className={styles.cardContainer}>
          <div className={styles.cardImageGroup}>
              <img src={originalImage || '/no-image.jpg'} className={styles.cardImage} alt={`${name} 원본 사진`} />
              <img src={genImage || '/no-image.jpg'} className={styles.cardImage} alt={`${name} 에이징 사진`} />
          </div>
          <p className={styles.cardNameText}>{name} ({gender})</p>
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