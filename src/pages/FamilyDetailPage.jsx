import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import styles from './FamilyDetailPage.module.css';

const IMAGE_HOST = 'http://202.31.202.8/images/';

export default function FamilyDetailPage() {
  const { familyId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!familyId) {
        console.log('familyId가 없습니다:', familyId);
        return;
      }
      console.log('상세 정보 조회 시작, familyId:', familyId);
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('/api/posts/detail_missing_search', null, {
          params: { missing_id: familyId },
        });
        console.log('API 응답:', response.data);
        setDetail(response.data);
      } catch (err) {
        console.error('가족 상세 조회 실패:', err);
        console.error('에러 상세:', err.response?.data || err.message);
        setError('가족 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [familyId]);

  const getImageUrl = (path) => {
    if (!path) return null;
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

  const infoRows = detail
    ? [
        { label: '이름', value: detail.missing_name },
        { label: '성별', value: detail.gender_id === 1 ? '남' : '여' },
        { label: '생년월일', value: formatDate(detail.missing_birth) },
        { label: '실종일', value: formatDate(detail.missing_date) },
        { label: '실종장소', value: detail.missing_place },
        { label: '사진 촬영 시 나이', value: detail.photo_age ? `${detail.photo_age}세` : '-' },
        { label: '등록자 ID', value: detail.user_id },
      ]
    : [];

  const originImage = getImageUrl(detail?.face_img_origin);
  const agingImage = getImageUrl(detail?.face_img_aging);

  return (
    <div>
      <Navbar />
      <main className={styles.wrapper}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.breadcrumb}>가족 찾기 &gt; 상세 정보</p>
            <h1 className={styles.title}>가족 상세 조회</h1>
            <p className={styles.subtitle}>가족이 등록한 상세 정보를 확인할 수 있습니다.</p>
          </div>
          <div className={styles.headerButtons}>
            <button type="button" className="btn-white" onClick={() => navigate(-1)}>
              목록으로
            </button>
            <button type="button" className="btn-mint" onClick={() => navigate('/face-similarity')}>
              얼굴 유사도 페이지
            </button>
          </div>
        </div>

        {loading && <div className={styles.stateBox}>정보를 불러오는 중입니다...</div>}
        {error && !loading && <div className={styles.stateBox}>{error}</div>}

        {!loading && !error && detail && (
          <>
            <section className={styles.profileSection}>
              <div className={styles.imagePanel}>
                <div className={styles.imageGroup}>
                  <div className={styles.imageItem}>
                    <img
                      src={originImage || '/no-image.jpg'}
                      alt={`${detail.missing_name} 원본 사진`}
                      className={styles.profileImage}
                    />
                    <p className={styles.imageCaption}>원본 사진</p>
                  </div>
                  {agingImage && (
                    <div className={styles.imageItem}>
                      <img
                        src={agingImage}
                        alt={`${detail.missing_name} 에이징 사진`}
                        className={styles.profileImage}
                      />
                      <p className={styles.imageCaption}>에이징 사진</p>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.infoPanel}>
                <div className={styles.infoGrid}>
                  {infoRows.map((row) => (
                    <div key={row.label} className={styles.infoRow}>
                      <span className={styles.infoLabel}>{row.label}</span>
                      <span className={styles.infoValue}>{row.value || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className={styles.descriptionSection}>
              <h2>실종 상황</h2>
              <p>{detail.missing_situation || '기록된 실종 상황 정보가 없습니다.'}</p>
            </section>

            <section className={styles.descriptionSection}>
              <h2>추가 단서</h2>
              <p>{detail.missing_extra_evidence || '추가 단서가 등록되지 않았습니다.'}</p>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

