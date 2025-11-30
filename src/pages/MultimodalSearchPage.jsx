import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../components/Navbar";
import Pagination from '../components/Pagination';
import FaceSimilarityCard from '../components/FaceSimilarityCard';
import Footer from "../components/Footer";

import { RiUserSearchFill } from "react-icons/ri";
import { MdFamilyRestroom } from "react-icons/md";

import styles from './MultimodalSearchPage.module.css';

export default function MultimodalSearchPage() {
    const [activeType, setActiveType] = useState('실종자');
    const [gender, setGender] = useState(1); // 1 = 남자, 2 = 여자
    const [similarityLists, setSimilarityLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 영문-한글 매핑 (서버 전송용 영문 값 → UI 표시용 한글)
    const attributeLabels = {
        // eyes_distance
        'narrow': '좁다',
        'normal': '보통',
        'wide': '넓다',
        // eyes_shape
        'deep_set': '오목눈',
        'narrowed': '실눈',
        'protruding': '돌출눈',
        'slanted': '째진눈',
        'sleepy': '졸린눈',
        // eyes_size
        'large': '크다',
        'small': '작다',
        // eyes_slant
        'down': '내려감',
        'up': '올라감',
        // eyes_type
        'double_eyelid': '쌍꺼풀',
        'in_eyelid': '속쌍꺼풀',
        'left_asym': '왼쪽 비대칭',
        'monolid': '외꺼풀 (무쌍꺼풀)',
        'right_asym': '오른쪽 비대칭',
        // nose_height
        'high': '높다',
        'low': '낮다',
        // nose_length
        'long': '길다',
        'short': '짧다',
        // nose_nostrils
        // nose_size
        // nose_top
        'angular': '각진형',
        'arrow': '화살코',
        'blunt': '뭉툭형',
        'bulbous': '주먹코',
        'concave': '버선코',
        'crooked': '휜코',
        'hump': '매부리코',
        'round': '둥근형',
        'upturned': '들창코',
        // mouth_ratio
        'equal': '위아래가 같다',
        'lower_big': '아랫입술이 크다',
        'upper_big': '윗입술이 크다',
        // mouth_shape
        'M_shape': 'M모양',
        'O_shape': 'O모양',
        'V_shape': 'V모양',
        'flat': 'ㅡ모양 (평평한 모양)',
        // mouth_side
        'drooping': '처짐',
        // mouth_size
        // mouth_thick
        'thick': '두껍다',
        'thin': '얇다',
        // mouth_type
    };
    
    // 얼굴 특징 속성 state - 영문 값으로 저장 (서버 전송용)
    const [faceAttributes, setFaceAttributes] = useState({
        // 눈 (5개 속성)
        eyes_distance: 'normal',
        eyes_shape: 'protruding',
        eyes_size: 'normal',
        eyes_slant: 'normal',
        eyes_type: 'in_eyelid',
        // 코 (5개 속성)
        nose_height: 'normal',
        nose_length: 'normal',
        nose_nostrils: 'normal',
        nose_size: 'normal',
        nose_top: 'angular',
        // 입 (6개 속성)
        mouth_ratio: 'lower_big',
        mouth_shape: 'M_shape',
        mouth_side: 'normal',
        mouth_size: 'normal',
        mouth_thick: 'normal',
        mouth_type: 'protruding'
    });
    
    // 영문 값을 한글 라벨로 변환하는 함수
    const getLabel = (value) => {
        return attributeLabels[value] || value;
    };

    // 버튼 클릭 핸들러
    const handleTypeClick = (type) => {
        setActiveType(type);
        setSimilarityLists([]); // 타입 변경 시 결과 초기화
    };

    // 성별 선택 핸들러
    const handleGenderChange = (e) => {
        const value = parseInt(e.target.value);
        setGender(value);
        setSimilarityLists([]); // 성별 변경 시 결과 초기화
    };

    // 얼굴 특징 선택 핸들러
    const handleAttributeChange = (key, value) => {
        setFaceAttributes(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // 유사도 검색 함수
    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            // 타입: 실종자=2, 가족=1
            const type = activeType === '실종자' ? 2 : 1;
            
            // faceAttributes는 이미 영문 값으로 저장되어 있음 (서버 전송용)
            // UI에서는 한글 라벨이 표시되지만, 실제 전송은 영문 값으로 이루어짐
            const requestBody = {
                type: type,
                attributes: faceAttributes, // 영문 값으로 전송
                gender: gender
            };
            
            const response = await axios.post(`/api/posts/multimodal_similarity`, requestBody, {
                withCredentials: true
            });
            
            if (response.data && response.data.similarPosts) {
                setSimilarityLists(response.data.similarPosts);
                console.log('멀티모달 유사도 데이터:', response.data.similarPosts);
            } else {
                setSimilarityLists([]);
                console.warn('유사도 데이터 형식이 올바르지 않습니다:', response.data);
            }
        } catch (error) {
            console.error('멀티모달 유사도 API 호출 중 오류 발생:', error);
            setError('유사도 정보를 불러오는 중 오류가 발생했습니다.');
            setSimilarityLists([]);
        } finally {
            setLoading(false);
        }
    };

    // 이미지 URL을 결합하는 유틸리티 함수
    const getImageUrl = (path) => {
        if (!path) return null;
        return `http://202.31.202.8/images/${path}`;
    };

    return (
        <div>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.descriptionGroup}>
                    <h1 className={styles.title}>멀티모달 검색</h1>
                    <p className={styles.description}>텍스트를 기반으로 유사한 얼굴형을 검색 할 수 있습니다.</p>
                </div>
                <div className={styles.conditionContainer}>
                    <div className={styles.typeContainer}>
                        <button onClick={() => handleTypeClick('실종자')} className={activeType === '실종자' ? styles.typeActivatedBtn : styles.typeBtn}><RiUserSearchFill className={styles.icon}/>실종자</button>
                        <button onClick={() => handleTypeClick('가족')} className={activeType === '가족' ? styles.typeActivatedBtn : styles.typeBtn}><MdFamilyRestroom className={styles.icon}/>가족</button>
                    </div>
                    <div className={styles.genderContainer} style={{ marginLeft: '10px' }}>
                        <select 
                            name="gender" 
                            className={styles.select} 
                            value={gender} 
                            onChange={handleGenderChange}
                            style={{ marginRight: '10px' }}
                        >
                            <option value="1">남자</option>
                            <option value="2">여자</option>
                        </select>
                    </div>
                    <button onClick={handleSearch} className="btn-mint" style={{ marginLeft: '10px' }}>
                        검색
                    </button>
                </div>
                <div className={styles.faceSimilarityCardsContainer}>
                    <div className={styles.selectedUserContainer}>
                        <p className={styles.cardNameText}>눈</p>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>사이 거리</p>
                            {/* value는 영문(서버 전송용), 텍스트는 한글(사용자 표시용) */}
                            <select name='eyes_distance' className={styles.select} value={faceAttributes.eyes_distance} onChange={(e) => handleAttributeChange('eyes_distance', e.target.value)}>
                                <option value="narrow">좁다</option>
                                <option value="normal">보통</option>
                                <option value="wide">넓다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>모양</p>
                            <select name='eyes_shape' className={styles.select} value={faceAttributes.eyes_shape} onChange={(e) => handleAttributeChange('eyes_shape', e.target.value)}>
                                <option value="deep_set">오목눈</option>
                                <option value="narrowed">실눈</option>
                                <option value="protruding">돌출눈</option>
                                <option value="slanted">째진눈</option>
                                <option value="sleepy">졸린눈</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>크기</p>
                            <select name='eyes_size' className={styles.select} value={faceAttributes.eyes_size} onChange={(e) => handleAttributeChange('eyes_size', e.target.value)}>
                                <option value="large">크다</option>
                                <option value="normal">보통</option>
                                <option value="small">작다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>기울기</p>
                            <select name='eyes_slant' className={styles.select} value={faceAttributes.eyes_slant} onChange={(e) => handleAttributeChange('eyes_slant', e.target.value)}>
                                <option value="down">내려감</option>
                                <option value="normal">보통</option>
                                <option value="up">올라감</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>눈꺼풀 유형</p>
                            <select name='eyes_type' className={styles.select} value={faceAttributes.eyes_type} onChange={(e) => handleAttributeChange('eyes_type', e.target.value)}>
                                <option value="double_eyelid">쌍꺼풀</option>
                                <option value="in_eyelid">속쌍꺼풀</option>
                                <option value="left_asym">왼쪽 비대칭</option>
                                <option value="monolid">외꺼풀 (무쌍꺼풀)</option>
                                <option value="right_asym">오른쪽 비대칭</option>
                            </select>
                        </div>
                        <p className={styles.cardNameText}>코</p>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>높이</p>
                            <select name='nose_height' className={styles.select} value={faceAttributes.nose_height} onChange={(e) => handleAttributeChange('nose_height', e.target.value)}>
                                <option value="high">높다</option>
                                <option value="low">낮다</option>
                                <option value="normal">보통</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>길이</p>
                            <select name='nose_length' className={styles.select} value={faceAttributes.nose_length} onChange={(e) => handleAttributeChange('nose_length', e.target.value)}>
                                <option value="long">길다</option>
                                <option value="normal">보통</option>
                                <option value="short">짧다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>콧구멍 크기</p>
                            <select name='nose_nostrils' className={styles.select} value={faceAttributes.nose_nostrils} onChange={(e) => handleAttributeChange('nose_nostrils', e.target.value)}>
                                <option value="narrow">좁다</option>
                                <option value="normal">보통</option>
                                <option value="wide">넓다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>크기</p>
                            <select name='nose_size' className={styles.select} value={faceAttributes.nose_size} onChange={(e) => handleAttributeChange('nose_size', e.target.value)}>
                                <option value="large">크다</option>
                                <option value="normal">보통</option>
                                <option value="small">작다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>코 끝 모양</p>
                            <select name='nose_top' className={styles.select} value={faceAttributes.nose_top} onChange={(e) => handleAttributeChange('nose_top', e.target.value)}>
                                <option value="angular">각진형</option>
                                <option value="arrow">화살코</option>
                                <option value="blunt">뭉툭형</option>
                                <option value="bulbous">주먹코</option>
                                <option value="concave">버선코</option>
                                <option value="crooked">휜코</option>
                                <option value="hump">매부리코</option>
                                <option value="round">둥근형</option>
                                <option value="upturned">들창코</option>
                            </select>
                        </div>
                        <p className={styles.cardNameText}>입</p>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입술 비율</p>
                            <select name='mouth_ratio' className={styles.select} value={faceAttributes.mouth_ratio} onChange={(e) => handleAttributeChange('mouth_ratio', e.target.value)}>
                                <option value="equal">위아래가 같다</option>
                                <option value="lower_big">아랫입술이 크다</option>
                                <option value="upper_big">윗입술이 크다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입 모양</p>
                            <select name='mouth_shape' className={styles.select} value={faceAttributes.mouth_shape} onChange={(e) => handleAttributeChange('mouth_shape', e.target.value)}>
                                <option value="M_shape">M모양</option>
                                <option value="O_shape">O모양</option>
                                <option value="V_shape">V모양</option>
                                <option value="flat">ㅡ모양 (평평한 모양)</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입 양쪽 모양</p>
                            <select name='mouth_side' className={styles.select} value={faceAttributes.mouth_side} onChange={(e) => handleAttributeChange('mouth_side', e.target.value)}>
                                <option value="drooping">처짐</option>
                                <option value="normal">보통</option>
                                <option value="up">올라감</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입 크기</p>
                            <select name='mouth_size' className={styles.select} value={faceAttributes.mouth_size} onChange={(e) => handleAttributeChange('mouth_size', e.target.value)}>
                                <option value="large">크다</option>
                                <option value="normal">보통</option>
                                <option value="small">작다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입술 두께</p>
                            <select name='mouth_thick' className={styles.select} value={faceAttributes.mouth_thick} onChange={(e) => handleAttributeChange('mouth_thick', e.target.value)}>
                                <option value="normal">보통</option>
                                <option value="thick">두껍다</option>
                                <option value="thin">얇다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입 돌출 유형</p>
                            <select name='mouth_type' className={styles.select} value={faceAttributes.mouth_type} onChange={(e) => handleAttributeChange('mouth_type', e.target.value)}>
                                <option value="concave">오목형</option>
                                <option value="normal">보통형</option>
                                <option value="protruding">돌출형</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.faceSimilarityCardList}>
                        {loading ? (
                            <p>유사도 정보를 불러오는 중...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : similarityLists.length > 0 ? (
                            similarityLists.map((item, index) => {
                                const uniqueId = item.post.mp_id || item.post.fp_id || index;
                                return (
                                    <FaceSimilarityCard 
                                        key={uniqueId}

                                        rank={index + 1}
                                        similarity={item.score}
                                        originalImage={getImageUrl(item.post.face_img_origin)}
                                        genImage={getImageUrl(item.post.face_img_aging)}
                                        name={item.post.missing_name}
                                        gender={item.post.gender_id === 1 ? '남' : '여'}
                                        birth={item.post.missing_birth}
                                        place={item.post.missing_place}
                                        date={item.post.missing_date}
                                        showGenImage={activeType === '가족' ? true : false}
                                        postId={uniqueId}
                                        userId={item.post.user_id}
                                        onDelete={(deletedId) => {
                                            setSimilarityLists(prev => 
                                                prev.filter(item => {
                                                    const id = item.post.mp_id || item.post.fp_id;
                                                    return id !== deletedId;
                                                })
                                            );
                                        }}
                                    />
                                );
                            })

                        ) : (
                            <p>검색 버튼을 눌러 유사도를 조회해주세요.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
