import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import RegionSelector from "../components/RegionSelector";
import styles from './FamilyEnrolPage.module.css';
import Footer from "../components/Footer";

const IMAGE_HOST = 'http://202.31.202.8/images/';

export default function FamilyEnrolPage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [imageSrc, setImageSrc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [resultImageSrc, setResultImageSrc] = useState("");
  const [missingSituation, setMissingSituation] = useState("");
  const [missingExtraEvidence, setMissingExtraEvidence] = useState("");
  const [missingPlace, setMissingPlace] = useState("");
  const [photoAge, setPhotoAge] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const navigate = useNavigate();

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode && editId) {
      const fetchPostData = async () => {
        try {
          setLoading(true);
          const response = await axios.post('/api/posts/detail_missing_search', null, {
            params: { missing_id: editId }
          });
          const data = response.data;
          
          // 폼 필드에 데이터 채우기
          if (document.getElementById('name')) document.getElementById('name').value = data.missing_name || '';
          if (document.getElementById('gender')) document.getElementById('gender').value = data.gender_id === 1 ? '남' : '여';
          if (document.getElementById('birth')) document.getElementById('birth').value = data.missing_birth || '';
          if (document.getElementById('missingDate')) document.getElementById('missingDate').value = data.missing_date || '';
          if (document.getElementById('photoAge')) document.getElementById('photoAge').value = data.photo_age || '';
          
          setMissingSituation(data.missing_situation || '');
          setMissingExtraEvidence(data.missing_extra_evidence || '');
          setMissingPlace(data.missing_place || '');
          setPhotoAge(data.photo_age ? String(data.photo_age) : '');
          
          // 이미지 미리보기
          if (data.face_img_origin) {
            setImageSrc(`${IMAGE_HOST}${data.face_img_origin}`);
          }
          if (data.face_img_aging) {
            setResultImageSrc(`${IMAGE_HOST}${data.face_img_aging}`);
          }
        } catch (error) {
          console.error('게시글 데이터 불러오기 실패:', error);
          alert('게시글 정보를 불러오지 못했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [isEditMode, editId]);

  const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          setImageFile(file); // Save the file object
          const reader = new FileReader();
          reader.onloadend = () => {
              setImageSrc(reader.result);
          };
          reader.readAsDataURL(file);
      } else {
          setImageFile(null);
          setImageSrc("");
      }
  };

  const handleImageGeneration = async () => {
      const birthDateInput = document.getElementById('birth');
      const missingBirth = birthDateInput.value;

      if (!imageFile || !missingBirth || !photoAge) {
          alert('이미지, 생년월일, 사진 당시 나이를 모두 입력해주세요.');
          return;
      }

      const formData = new FormData();
      formData.append('img', imageFile);
      formData.append('missing_birth', missingBirth);
      formData.append('photo_age', photoAge);

      try {
          const response = await axios.post('/api/posts/img_aging', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
              responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(response.data);
          setResultImageSrc(imageUrl);
          alert('이미지 생성 성공!');
      } catch (error) {
          console.error('이미지 생성 실패:', error);
          alert('이미지 생성 실패!');
      }
  };

  const handleFormSubmit = async (e) => {
      e.preventDefault();

      // 폼 필드에서 데이터 가져오기
      const name = document.getElementById('name').value;
      const gender = document.getElementById('gender').value;
      const birth = document.getElementById('birth').value;
      const missingDate = document.getElementById('missingDate').value;
      const missing_place = missingPlace;

      // 필수 필드 유효성 검사
      if (!name || !birth || !missingDate || !photoAge) {
          alert('모든 필수 정보를 입력해 주세요.');
          return;
      }

      // 수정 모드와 등록 모드 분기
      if (isEditMode) {
          // 수정 모드
          const formData = new FormData();
          formData.append('missing_id', editId);
          formData.append('type', 1);
          formData.append('missing_name', name);
          if (imageFile) {
              formData.append('img_origin', imageFile);
          }
          if (resultImageSrc && resultImageSrc.startsWith('blob:')) {
              // 새로 생성된 이미지인 경우
              const agingImageBlob = await fetch(resultImageSrc).then(res => res.blob());
              formData.append('img_aging', agingImageBlob, 'aged_image.png');
          }
          formData.append('gender', gender);
          formData.append('missing_birth', birth);
          formData.append('missing_date', missingDate);
          formData.append('missing_situation', missingSituation);
          formData.append('missing_extra_evidence', missingExtraEvidence);
          formData.append('missing_place', missing_place);
          formData.append('photo_age', parseInt(photoAge) || 0);

          try {
              const response = await axios.post('/api/posts/update_post', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
              console.log('수정 성공:', response.data);
              alert('실종자 정보가 성공적으로 수정되었습니다!');
              navigate('/mypage');
          } catch (error) {
              console.error('수정 실패:', error.response ? error.response.data : error.message);
              alert('수정 실패!');
          }
      } else {
          // 등록 모드
          if (!imageFile || !resultImageSrc) {
              alert('모든 필수 정보를 입력하고, 이미지 생성을 먼저 진행해 주세요.');
              return;
          }

          const formData = new FormData();
          formData.append('type', 1);
          formData.append('name', name);
          formData.append('img_origin', imageFile); // 원본 이미지
          
          // 생성된 이미지가 있을 경우에만 추가
          if (resultImageSrc) {
              // URL을 fetch하여 Blob으로 변환 후 FormData에 추가
              const agingImageBlob = await fetch(resultImageSrc).then(res => res.blob());
              formData.append('img_aging', agingImageBlob, 'aged_image.png');
          }
          
          formData.append('gender', gender);
          formData.append('birth', birth);
          formData.append('missingDate', missingDate);
          formData.append('missing_situation', missingSituation);
          formData.append('missing_extra_evidence', missingExtraEvidence);
          formData.append('missing_place', missing_place);
          formData.append('photo_age', parseInt(photoAge) || 0); // 사진 당시 나이

          try {
              const response = await axios.post('/api/posts/upload', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
              console.log('등록 성공:', response.data);
              alert('실종자 정보가 성공적으로 등록되었습니다!');
          } catch (error) {
              console.error('등록 실패:', error.response ? error.response.data : error.message);
              alert('등록 실패!');
          }
          navigate('/family');
      }
  };
  return (
    <div>
      <Navbar/>
      <form onSubmit={handleFormSubmit} className={styles.container}>
          <div className={styles.descriptionGroup}>
              <h1 className={styles.title}>{isEditMode ? '실종자 정보 수정' : '실종자 등록 (가족)'}</h1>
              <p className={styles.description}>
                  {isEditMode ? '실종자 정보를 수정할 수 있습니다.' : '가족이 실종자를 등록하는 페이지 입니다.'}
              </p>
          </div>
          <div className={styles.missingEnrolContainer}>
              <div className={styles.imageContainer}>
                  <div className={styles.inputContainer}>
                      <label htmlFor="input-image">
                          <div className={styles.inputImageContainer}>
                              {imageSrc ? (
                                  <img src={imageSrc} className={styles.previewImage} alt="선택 이미지 미리보기"/>
                              ) : (
                                  <p className={styles.description}>실종자 사진을 드래그 하거나 선택 해주세요.</p>
                              )}
                          </div>
                      </label>
                  </div>
                  {resultImageSrc ? (
                      <img src={resultImageSrc} className={styles.outputImageContainer}/>
                  ) : (
                      <div className={styles.outputImageContainer}>
                          <p>생성 이미지</p>
                      </div>
                  )}
              </div>
              <div className={styles.infoContainer}>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>이름</p>
                      <input
                          type="text"
                          id="name"
                          className={styles.formInput}
                          required
                      />
                  </div>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>성별</p>
                      <select name='gender' id='gender' className={styles.select}>
                          <option value="남">남</option>
                          <option value="여">여</option>
                      </select>
                  </div>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>생년월일</p>
                      <input
                          type="date"
                          id="birth"
                          className={styles.formInput}
                          required
                      />
                  </div>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>사진 당시 나이</p>
                      <input
                          type="number"
                          id="photoAge"
                          className={styles.formInput}
                          min="0"
                          max="120"
                          value={photoAge}
                          onChange={(e) => setPhotoAge(e.target.value)}
                          placeholder="사진 촬영 당시 나이를 입력하세요"
                          required
                      />
                  </div>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>실종날짜</p>
                      <input
                          type="date"
                          id="missingDate"
                          className={styles.formInput}
                          required
                      />
                  </div>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>실종장소</p>
                      <RegionSelector
                          value={missingPlace}
                          onChange={setMissingPlace}
                      />
                  </div>
                  {/* --- 새로운 필드 추가 --- */}
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>실종 상황</p>
                      <textarea
                          id="missingSituation"
                          className={styles.textArea}
                          value={missingSituation}
                          onChange={(e) => setMissingSituation(e.target.value)}
                          rows="4"
                      />
                  </div>
                  <div className={styles.infoOneContainer}>
                      <p className={styles.infoKey}>인상착의</p>
                      <textarea
                          id="missingExtraEvidence"
                          className={styles.textArea}
                          value={missingExtraEvidence}
                          onChange={(e) => setMissingExtraEvidence(e.target.value)}
                          rows="4"
                      />
                  </div>
                  {/* --- 기존 버튼 그룹 --- */}
                  <div className={styles.btnGroup}>
                      <button type="button" className="btn-mint" onClick={handleImageGeneration}>이미지 생성</button>
                      <button type="button" className="btn-mint" onClick={() => setResultImageSrc("")}>이미지 삭제</button>
                  </div>
              </div>
              <input
                  type="file"
                  id="input-image"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
              />
          </div>
          <div className={styles.enrolBtn}>
              {loading ? (
                  <p>게시글 정보를 불러오는 중...</p>
              ) : (
                  <button type="submit" className="btn-mint">{isEditMode ? '수정' : '등록'}</button>
              )}
          </div>
      </form>
      <Footer/>
  </div>
  );
}