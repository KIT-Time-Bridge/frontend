import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [missingPosts, setMissingPosts] = useState([]);
  const [familyPosts, setFamilyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('missing'); // 'missing' or 'family'
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadPosts();
  }, []);

  const checkAdminAndLoadPosts = async () => {
    try {
      // 관리자 확인
      const adminCheck = await axios.get('/api/users/is_admin', {
        withCredentials: true
      });

      if (!adminCheck.data.is_admin) {
        alert('관리자 권한이 필요합니다.');
        navigate('/');
        return;
      }

      // 승인 대기 게시글 조회
      await loadPendingPosts();
    } catch (error) {
      console.error('관리자 확인 실패:', error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        alert('관리자 페이지 접근에 실패했습니다.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPendingPosts = async () => {
    try {
      const response = await axios.get('/api/posts/pending', {
        withCredentials: true
      });
      setMissingPosts(response.data.missing_posts || []);
      setFamilyPosts(response.data.family_posts || []);
    } catch (error) {
      console.error('승인 대기 게시글 조회 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  const handleApprove = async (postId) => {
    if (!window.confirm('이 게시글을 승인하시겠습니까?')) {
      return;
    }

    try {
      await axios.post('/api/posts/approve', null, {
        params: { missing_id: postId },
        withCredentials: true
      });
      alert('게시글이 승인되었습니다.');
      // 목록 새로고침
      await loadPendingPosts();
    } catch (error) {
      console.error('게시글 승인 실패:', error);
      alert('게시글 승인에 실패했습니다.');
    }
  };

  const handleReject = async (postId) => {
    if (!window.confirm('이 게시글을 거절하시겠습니까? 거절된 게시글은 삭제됩니다.')) {
      return;
    }

    try {
      await axios.post('/api/posts/reject', null, {
        params: { post_id: postId },
        withCredentials: true
      });
      alert('게시글이 거절되었습니다.');
      // 목록 새로고침
      await loadPendingPosts();
    } catch (error) {
      console.error('게시글 거절 실패:', error);
      alert('게시글 거절에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, {
        withCredentials: true
      });
      alert('로그아웃되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      alert('로그아웃에 실패했습니다.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/no-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://202.31.202.8/images/${imagePath}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>관리자 페이지</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'missing' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('missing')}
        >
          실종자 찾기 ({missingPosts.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'family' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('family')}
        >
          가족 찾기 ({familyPosts.length})
        </button>
      </div>

      <div className={styles.postsContainer}>
        {activeTab === 'missing' ? (
          <div className={styles.postsList}>
            {missingPosts.length === 0 ? (
              <p className={styles.emptyMessage}>승인 대기 중인 실종자 게시글이 없습니다.</p>
            ) : (
              missingPosts.map((post) => (
                <div key={post.mp_id} className={styles.postCard}>
                  <div className={styles.postImage}>
                    <img
                      src={getImageUrl(post.face_img_origin)}
                      alt={post.missing_name}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.postInfo}>
                    <h3 className={styles.postName}>{post.missing_name}</h3>
                    <div className={styles.postDetails}>
                      <p><strong>생년월일:</strong> {post.missing_birth || '-'}</p>
                      <p><strong>실종일자:</strong> {post.missing_date || '-'}</p>
                      <p><strong>실종장소:</strong> {post.missing_place || '-'}</p>
                      <p><strong>실종상황:</strong> {post.missing_situation || '-'}</p>
                      <p><strong>추가단서:</strong> {post.missing_extra_evidence || '-'}</p>
                    </div>
                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleApprove(post.mp_id)}
                      >
                        승인
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleReject(post.mp_id)}
                      >
                        거절
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className={styles.postsList}>
            {familyPosts.length === 0 ? (
              <p className={styles.emptyMessage}>승인 대기 중인 가족 찾기 게시글이 없습니다.</p>
            ) : (
              familyPosts.map((post) => (
                <div key={post.fp_id} className={styles.postCard}>
                  <div className={styles.postImage}>
                    <img
                      src={getImageUrl(post.face_img_origin)}
                      alt={post.missing_name}
                      className={styles.image}
                    />
                    {post.face_img_aging && (
                      <img
                        src={getImageUrl(post.face_img_aging)}
                        alt={`${post.missing_name} 노화 이미지`}
                        className={styles.image}
                      />
                    )}
                  </div>
                  <div className={styles.postInfo}>
                    <h3 className={styles.postName}>{post.missing_name}</h3>
                    <div className={styles.postDetails}>
                      <p><strong>생년월일:</strong> {post.missing_birth || '-'}</p>
                      <p><strong>실종일자:</strong> {post.missing_date || '-'}</p>
                      <p><strong>실종장소:</strong> {post.missing_place || '-'}</p>
                      <p><strong>사진 나이:</strong> {post.photo_age || '-'}</p>
                      <p><strong>실종상황:</strong> {post.missing_situation || '-'}</p>
                      <p><strong>추가단서:</strong> {post.missing_extra_evidence || '-'}</p>
                    </div>
                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleApprove(post.fp_id)}
                      >
                        승인
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleReject(post.fp_id)}
                      >
                        거절
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

