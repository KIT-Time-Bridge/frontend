import React, { useState, useEffect } from 'react';
// 1. Link 대신 useNavigate를 사용합니다. (Link는 남겨도 무방하나 여기선 사용 안 함)
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import FamilyCard from "../components/FamilyCard";
import Pagination from '../components/Pagination';
import Footer from "../components/Footer";

import styles from './FamilyPage.module.css';

export default function FamilyPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cardData, setCardData] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [searchFilters, setSearchFilters] = useState({
        search_keywords: null,
        gender_id: null,
        missing_birth: null,
        missing_date: null,
        missing_place: null,
    });

    // 2. useNavigate 훅을 초기화합니다.
    const navigate = useNavigate();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const fetchFamilyPosts = async () => {
            try {
                // 필터가 하나라도 있으면 검색 파라미터에 포함
                const hasFilters = searchFilters.search_keywords || searchFilters.gender_id || searchFilters.missing_birth || searchFilters.missing_date || searchFilters.missing_place;
                
                const params = {
                    pageNum: currentPage,
                };
                
                if (hasFilters) {
                    if (searchFilters.search_keywords) params.search_keywords = searchFilters.search_keywords;
                    if (searchFilters.gender_id) params.gender_id = parseInt(searchFilters.gender_id);
                    if (searchFilters.missing_birth) params.missing_birth = searchFilters.missing_birth;
                    if (searchFilters.missing_date) params.missing_date = searchFilters.missing_date;
                    if (searchFilters.missing_place) params.missing_place = searchFilters.missing_place;
                }
                
                const response = await axios.post('/api/posts/all_missing_search_family', null, { params });
                const familyData = response.data.posts;

                const transformedData = familyData.map(item => {
                    return {
                        id: item.fp_id,
                        originalImage: item.face_img_origin,
                        genImage: item.face_img_aging,
                        name: item.missing_name,
                        gender: item.gender_id,
                        birth: item.missing_birth,
                        place: item.missing_place,
                        date: item.missing_date,
                    };
                });
                
                setCardData(transformedData);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error("Error fetching family posts data:", error);
                setCardData([]);
            }
        };

        fetchFamilyPosts();
    }, [currentPage, searchFilters]);

    const handlePageChange = (page) => {
        setSearchParams({ page: page });
    };

    const handleSearch = (filters) => {
        setSearchFilters(filters);
        setSearchParams({ page: 1 }); // 검색 시 첫 페이지로 이동
    };

    const calculatePageGroup = () => {
        const groupSize = 10;
        const startGroupPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
        let endGroupPage = startGroupPage + groupSize - 1;

        if (endGroupPage > totalPages) {
            endGroupPage = totalPages;
        }
        return { startPage: startGroupPage, endPage: endGroupPage };
    };

    const { startPage, endPage } = calculatePageGroup();

    const getImageUrl = (path) => {
        if (!path) return null;
        return `http://202.31.202.8/images/${path}`;
    };

    // 3. '실종자 등록' 버튼 클릭 핸들러 함수
    const handleEnrolClick = async () => {
        try {
            // 4. 로그인 상태 확인 API 호출
            const response = await axios.get('/api/users/status');
            
            // 5. 로그인 상태(true/false)에 따라 분기
            if (response.data === true) {
                // 6. 로그인 O -> 등록 페이지로 이동
                navigate('/family-enrol');
            } else {
                // 7. 로그인 X -> 경고창 표시
                alert('로그인이 필요한 기능입니다.');
            }
        } catch (error) {
            // 8. API 호출 실패 시 (네트워크 오류, 서버 오류 등)
            console.error("로그인 상태 확인 오류:", error);
            // 에러 시에도 로그인되지 않은 것으로 간주하고 경고창 표시
            alert('로그인 상태를 확인하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.missingDescriptionGroup}>
                    <h1 className={styles.missingTitle}>가족 찾기</h1>
                    <p className={styles.missingDescription}>가족들이 등록한 실종자 게시판 입니다.</p>
                </div>
                <Searchbar 
                    onSearch={handleSearch}
                    searchFilters={searchFilters}
                />
                <div className={styles.enrolBtn}>
                    {/* 9. <Link>를 <button>으로 변경하고 onClick에 핸들러 연결 */}
                    <button className="btn-mint" onClick={handleEnrolClick}>
                        실종자 등록
                    </button>
                </div>
                <div className={styles.conditionContainer}>
                    {/* 조건 검색 UI가 여기에 들어갑니다. */}
                </div>
                <div className={styles.cardListContainer}>
                    {cardData.map((item) => (
                        <FamilyCard 
                            key={item.id}
                            id={item.id}
                            originalImage={getImageUrl(item.originalImage)}
                            genImage={getImageUrl(item.genImage)}
                            name={item.name}
                            gender={item.gender === 1 ? '남' : '여'}
                            birth={item.birth}
                            place={item.place}
                            date={item.date}
                        />
                    ))}
                </div>
                <Pagination
                    startPage={startPage}
                    endPage={endPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <Footer/>
        </div>
    );
}