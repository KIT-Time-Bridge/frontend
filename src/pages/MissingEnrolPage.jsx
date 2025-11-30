import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import RegionSelector from "../components/RegionSelector";
import styles from './MissingEnrolPage.module.css';
import Footer from "../components/Footer";

const IMAGE_HOST = 'http://202.31.202.8/images/';

export default function MissingEnrolPage() {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;
    
    const [imageSrc, setImageSrc] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [missingSituation, setMissingSituation] = useState("");
    const [missingExtraEvidence, setMissingExtraEvidence] = useState("");
    const [missingPlace, setMissingPlace] = useState("");
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
                    
                    setMissingSituation(data.missing_situation || '');
                    setMissingExtraEvidence(data.missing_extra_evidence || '');
                    setMissingPlace(data.missing_place || '');
                    
                    // 이미지 미리보기
                    if (data.face_img_origin) {
                        setImageSrc(`${IMAGE_HOST}${data.face_img_origin}`);
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
            setImageFile(file);
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // 폼 필드에서 데이터 가져오기
        const name = document.getElementById('name').value;
        const gender = document.getElementById('gender').value;
        const birth = document.getElementById('birth').value;
        const missingDate = document.getElementById('missingDate').value;
        const missing_place = missingPlace;

        // 필수 필드 유효성 검사
        if (!name || !birth || !missingDate) {
            alert('모든 필수 정보를 입력해 주세요.');
            return;
        }

        // 수정 모드와 등록 모드 분기
        if (isEditMode) {
            // 수정 모드
            const formData = new FormData();
            formData.append('missing_id', editId);
            formData.append('type', 2);
            formData.append('missing_name', name);
            if (imageFile) {
                formData.append('img_origin', imageFile);
            }
            formData.append('gender', gender);
            formData.append('missing_birth', birth);
            formData.append('missing_date', missingDate);
            formData.append('missing_situation', missingSituation);
            formData.append('missing_extra_evidence', missingExtraEvidence);
            formData.append('missing_place', missing_place);

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
            if (!imageFile) {
                alert('이미지를 선택해 주세요.');
                return;
            }

            const formData = new FormData();
            formData.append('type', 2);
            formData.append('name', name);
            formData.append('img_origin', imageFile);
            formData.append('gender', gender);
            formData.append('birth', birth);
            formData.append('missingDate', missingDate);
            formData.append('missing_situation', missingSituation);
            formData.append('missing_extra_evidence', missingExtraEvidence);
            formData.append('missing_place', missing_place);
            formData.append('photo_age', 0);

            try {
                const response = await axios.post('/api/posts/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('등록 성공:', response.data);
                alert('실종자 정보가 성공적으로 등록되었습니다!');
                navigate('/missing');
            } catch (error) {
                console.error('등록 실패:', error.response ? error.response.data : error.message);
                alert('등록 실패!');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <form onSubmit={handleFormSubmit} className={styles.container}>
                <div className={styles.descriptionGroup}>
                    <h1 className={styles.title}>{isEditMode ? '실종자 정보 수정' : '실종자 등록 (본인)'}</h1>
                    <p className={styles.description}>
                        {isEditMode ? '실종자 정보를 수정할 수 있습니다.' : '실종자 본인이 실종자를 등록하는 페이지 입니다.'}
                    </p>
                </div>
                <div className={styles.missingEnrolContainer}>
                    <div className={styles.imageContainer}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="input-image">
                                <div className={styles.inputImageContainer}>
                                    {imageSrc ? (
                                        <img src={imageSrc} className={styles.previewImage} alt="선택 이미지 미리보기" />
                                    ) : (
                                        <p className={styles.description}>실종자 사진을 드래그 하거나 선택 해주세요.</p>
                                    )}
                                </div>
                            </label>
                            <input
                                type="file"
                                id="input-image"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
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
                    </div>
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