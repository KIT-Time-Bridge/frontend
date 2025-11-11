import styles from './FamilyCard.module.css'
import { Link } from 'react-router-dom';

export default function MissingCard({ originalImage, genImage, name, gender, birth, place, date }) {
  return (
    <div className={styles.cardContainer}>
        <div className={styles.cardImageGroup}>
            <img src={originalImage} className={styles.cardImage} />
            <img src={genImage} className={styles.cardImage} />
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
  );
}