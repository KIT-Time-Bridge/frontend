import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import styles from './MyPage.module.css';

const IMAGE_HOST = 'http://202.31.202.8/images/';

export default function MyPage() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('실종자');
  const [posts, setPosts] = useState({
    missing_posts: [],
    family_posts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/posts/register_missing_search');
        setPosts(response.data);
      } catch (err) {
        console.error('내 게시글 조회 실패:', err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDelete = async (postId, type) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.post('/api/posts/delete_post', null, {
        params: { missing_id: postId }
      });
      alert('게시글이 삭제되었습니다.');
      
      // 삭제 후 목록 새로고침
      const response = await axios.post('/api/posts/register_missing_search');
      setPosts(response.data);
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '/no-image.jpg';
    return `${IMAGE_HOST}${path}`;
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString('ko-KR');
  };

  const currentPosts = activeType === '실종자' ? posts.missing_posts : posts.family_posts;

  return (
    <div>
      <Navbar />
      <main className={styles.wrapper}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>마이페이지</h1>
            <p className={styles.subtitle}>내가 등록한 게시글을 확인하고 관리할 수 있습니다.</p>
          </div>
        </div>

        <div className={styles.typeContainer}>
          <button
            onClick={() => setActiveType('실종자')}
            className={activeType === '실종자' ? styles.typeActivatedBtn : styles.typeBtn}
          >
            실종자 찾기
          </button>
          <button
            onClick={() => setActiveType('가족')}
            className={activeType === '가족' ? styles.typeActivatedBtn : styles.typeBtn}
          >
            가족 찾기
          </button>
        </div>

        {loading && <div className={styles.stateBox}>게시글을 불러오는 중입니다...</div>}
        {error && !loading && <div className={styles.stateBox}>{error}</div>}

        {!loading && !error && (
          <>
            {currentPosts.length === 0 ? (
              <div className={styles.stateBox}>
                등록한 {activeType === '실종자' ? '실종자' : '가족'} 게시글이 없습니다.
              </div>
            ) : (
              <div className={styles.postsGrid}>
                {currentPosts.map((post) => {
                  const postId = post.mp_id || post.fp_id;
                  const isMissing = !!post.mp_id;
                  
                  return (
                    <div key={postId} className={styles.postCard}>
                      <div className={styles.postImage}>
                        <img
                          src={getImageUrl(post.face_img_origin)}
                          alt={post.missing_name}
                          className={styles.cardImage}
                        />
                        {!isMissing && post.face_img_aging && (
                          <img
                            src={getImageUrl(post.face_img_aging)}
                            alt={`${post.missing_name} 에이징`}
                            className={styles.cardImage}
                          />
                        )}
                      </div>
                      <div className={styles.postInfo}>
                        <h3 className={styles.postName}>{post.missing_name}</h3>
                        <div className={styles.postDetails}>
                          <p>성별: {post.gender_id === 1 ? '남' : '여'}</p>
                          <p>생년월일: {formatDate(post.missing_birth)}</p>
                          {post.missing_date && (
                            <p>실종일: {formatDate(post.missing_date)}</p>
                          )}
                          {post.missing_place && (
                            <p>실종장소: {post.missing_place}</p>
                          )}
                        </div>
                        <div className={styles.postActions}>
                          <button
                            className="btn-mint"
                            onClick={() => navigate(isMissing ? `/missing/${postId}` : `/family/${postId}`)}
                          >
                            상세보기
                          </button>
                          <button
                            className="btn-white"
                            onClick={() => handleDelete(postId, activeType)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

