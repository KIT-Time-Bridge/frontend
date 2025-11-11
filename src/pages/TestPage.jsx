import React, { useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [image, setImage] = useState(null);
  const [number, setNumber] = useState('');
  const [resultImage, setResultImage] = useState(null); // 결과 이미지 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !number) {
      alert('이미지와 날짜를 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('img', image);
    formData.append('missing_birth', number);

    try {
      const response = await axios.post('/api/posts/img_aging', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // 👈 이미지 데이터(blob)로 받음
      });

      // blob -> URL 변환 후 state 저장
      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);

      alert('업로드 성공!');
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 실패!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>이미지와 날짜 입력</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이미지 선택: </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>생년월일 입력: </label>
          <input
            type="date"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: '1.5rem' }}>
          제출
        </button>
      </form>

      {/* 결과 이미지 표시 */}
      {resultImage && (
        <div style={{ marginTop: '2rem' }}>
          <h3>결과 이미지</h3>
          <img src={resultImage} alt="결과" style={{ maxWidth: '400px' }} />
        </div>
      )}
    </div>
  );
}
