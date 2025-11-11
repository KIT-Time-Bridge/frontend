import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from "../components/Navbar";
import Pagination from '../components/Pagination';
import Searchbar from '../components/Searchbar';
import FaceSimilarityCard from '../components/FaceSimilarityCard';
import Footer from "../components/Footer";

import { RiUserSearchFill } from "react-icons/ri";
import { MdFamilyRestroom } from "react-icons/md";

import styles from './MultimodalSearchPage.module.css';

const userLists = [
    {
        id: 0,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '홍길동',
        gender: '남',
        birth: '1990년 1월 1일',
    },
    {
        id: 1,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '김철수',
        gender: '남',
    },
    {
        id: 2,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '박영희',
        gender: '여',
    },
    {
        id: 3,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '이민호',
        gender: '남',
    },
]; 

const similarityLists= [
    {
        id: 1,
        rank: 1,
        similarity: 95.2,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '홍길동',
        gender: '남',
        birth: '1990년 1월 1일',
        place: '서울',
        date: '2023년 10월 26일'
    },
    {
        id: 2,
        rank: 2,
        similarity: 90.5,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '김철수',
        gender: '남',
        birth: '1991년 2월 2일',
        place: '부산',
        date: '2023년 11월 1일'
    },
    {
        id: 4,
        rank: 3,
        similarity: 88.7,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '이민호',
        gender: '남',
        birth: '1988년 4월 4일',
        place: '광주',
        date: '2023년 11월 15일'
    },
    {
        id: 6,
        rank: 4,
        similarity: 85.3,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '윤지훈',
        gender: '남',
        birth: '1993년 6월 6일',
        place: '강릉',
        date: '2023년 11월 25일'
    },
    {
        id: 8,
        rank: 5,
        similarity: 82.1,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '정우성',
        gender: '남',
        birth: '1987년 8월 8일',
        place: '수원',
        date: '2023년 12월 5일'
    },
    {
        id: 11,
        rank: 6,
        similarity: 78.9,
        originalImage: '../public/no-image.jpg',
        genImage: '../public/no-image.jpg',
        name: '서준영',
        gender: '남',
        birth: '1998년 11월 11일',
        place: '울산',
        date: '2023년 12월 20일'
    },
]; 

const selectUserCard = {
    originalImage: '../public/no-image.jpg',
    genImage: '../public/no-image.jpg',
    name: '홍길동',
    gender: '남',
    birth: '1990년 1월 1일',
    place: '서울',
    date: '2023년 10월 26일'
};

export default function FaceSimilarityPage() {

    const [activeType, setActiveType] = useState('실종자');

    // 버튼 클릭 핸들러
    const handleTypeClick = (type) => {
        setActiveType(type);
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
                </div>
                <div className={styles.faceSimilarityCardsContainer}>
                    <div className={styles.selectedUserContainer}>
                        <p className={styles.cardNameText}>눈</p>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>크기</p>
                            <select name='size' id='size' className={styles.select}>
                                <option value="작다">작다</option>
                                <option value="보통">보통</option>
                                <option value="크다">크다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>유형</p>
                            <select name='type' id='type' className={styles.select}>
                                <option value="속쌍커풀">속쌍커풀</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>간격</p>
                            <select name='distance' id='distance' className={styles.select}>
                                <option value="넓다">넓다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>간격</p>
                            <select name='distance' id='distance' className={styles.select}>
                                <option value="넓다">넓다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>경사</p>
                            <select name='slant' id='slant' className={styles.select}>
                                <option value="내려감">내려감</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>모양</p>
                            <select name='shape' id='shape' className={styles.select}>
                                <option value="돌출눈">돌출눈</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>눈꺼풀</p>
                            <select name='eyelids' id='eyelids' className={styles.select}>
                                <option value="넓다">넓다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>(눈 밑) 아래</p>
                            <select name='bottom' id='bottom' className={styles.select}>
                                <option value="분류없음">분류없음</option>
                            </select>
                        </div>
                        <p className={styles.cardNameText}>코</p>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>크기</p>
                            <select name='size' id='size' className={styles.select}>
                                <option value="작다">작다</option>
                                <option value="보통">보통</option>
                                <option value="크다">크다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>길이</p>
                            <select name='length' id='length' className={styles.select}>
                                <option value="길다">길다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>높이</p>
                            <select name='height' id='height' className={styles.select}>
                                <option value="낮다">낮다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>콧등</p>
                            <select name='top' id='top' className={styles.select}>
                                <option value="각진형">각진형</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>콧구멍</p>
                            <select name='nostrils' id='nostrils' className={styles.select}>
                                <option value="넓다">넓다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>인중</p>
                            <select name='philtrum' id='philtrum' className={styles.select}>
                                <option value="길다">길다</option>
                            </select>
                        </div>
                        <p className={styles.cardNameText}>입</p>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>유형</p>
                            <select name='type' id='type' className={styles.select}>
                                <option value="돌출형">돌출형</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>크기</p>
                            <select name='size' id='size' className={styles.select}>
                                <option value="작다">작다</option>
                                <option value="보통">보통</option>
                                <option value="크다">크다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>모양</p>
                            <select name='shape' id='shape' className={styles.select}>
                                <option value="M모양">M모양</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>두께</p>
                            <select name='thick' id='thick' className={styles.select}>
                                <option value="두껍다">두껍다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>비율</p>
                            <select name='ratio' id='ratio' className={styles.select}>
                                <option value="아랫입술이 크다">아랫입술이 크다</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입꼬리</p>
                            <select name='side' id='side' className={styles.select}>
                                <option value="보통">보통</option>
                            </select>
                        </div>
                        <div className={styles.infoOneContainer}>
                            <p className={styles.infoKey}>입술선</p>
                            <select name='line' id='line' className={styles.select}>
                                <option value="뚜렷함">뚜렷함</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.faceSimilarityCardList}>
                        {similarityLists.map((item) => (
                            <FaceSimilarityCard rank={item.rank} similarity={item.similarity} originalImage={item.originalImage} genImage={item.genImage} name={item.name} gender={item.gender} birth={item.birth} place={item.place} date={item.date}></FaceSimilarityCard>  
                        ))}
                        <Pagination startPage={1} endPage={5}></Pagination>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}