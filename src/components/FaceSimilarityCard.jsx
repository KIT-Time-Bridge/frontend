import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './FaceSimilarityCard.module.css';

export default function FaceSimilarityCard({ 
  rank, 
  similarity, 
  originalImage, 
  genImage, 
  name, 
  gender, 
  birth, 
  place, 
  date, 
  showGenImage,
  postId,
  userId,
  onDelete
}) {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const statusResponse = await axios.get('/api/users/status');
        setIsLoggedIn(statusResponse.data === true);
        
        if (statusResponse.data) {
          const userResponse = await axios.get('/api/users/current_user');
          setCurrentUserId(userResponse.data.user_id);
        }
      } catch (error) {
        console.error('로그인 상태 확인 오류:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.post('/api/posts/delete_post', null, {
        params: { missing_id: postId }
      });
      alert('게시글이 삭제되었습니다.');
      if (onDelete) {
        onDelete(postId);
      }
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const formattedSimilarity = typeof similarity === 'number' ? (similarity*100).toFixed(2) : similarity;
  const isMyPost = currentUserId && userId && currentUserId === userId;
  const postType = postId && postId[0] === 'm' ? 'missing' : 'family';

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
              {!showGenImage && genImage && <img src={genImage} className={styles.cardImage} />}
          </div>
          <div className={styles.cardActions}>
            <button 
              className="btn-mint" 
              onClick={() => navigate(`/${postType}/${postId}`)}
            >
              상세보기
            </button>
            {isLoggedIn && isMyPost && (
              <button 
                className="btn-white" 
                onClick={handleDelete}
              >
                삭제
              </button>
            )}
          </div>
      </div>
    </div>
  );
}