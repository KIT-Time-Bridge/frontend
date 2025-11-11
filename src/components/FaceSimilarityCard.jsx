import styles from './FaceSimilarityCard.module.css'
import { Link } from 'react-router-dom';

export default function FaceSimilarityCard({ rank, similarity, originalImage, genImage, name, gender, birth, place, date, showGenImage }) {
  const formattedSimilarity = typeof similarity === 'number' ? (similarity*100).toFixed(2) : similarity;
  return (
    <div>
        <div className={styles.cardContainer}>
          <div className={styles.cardRank}>
              <p className={styles.cardNameText}>{rank} 순위</p>
              <p className={styles.cardNameText}>{formattedSimilarity} %</p>
          </div>
          <div className={styles.cardInfo}>
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
          <div className={styles.cardImageGroup}>
              <img src={originalImage} className={styles.cardImage} />
              {!showGenImage && <img src={genImage} className={styles.cardImage} />}
          </div>
      </div>
    </div>
  );
}