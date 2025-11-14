import React, { useState, useEffect } from 'react';
// 1. useNavigate 훅을 import합니다.
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import MissingCard from "../components/MissingCard";
import Pagination from '../components/Pagination';
import Footer from "../components/Footer";

import styles from './MissingPage.module.css';

export default function MissingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cardData, setCardData] = useState([]);
    const [totalPages, setTotalPages] = useState(); 
    const [searchFilters, setSearchFilters] = useState({
        missing_name: null,
        missing_situation: null,
        missing_extra_evidence: null,
    });

    // 2. useNavigate 훅을 초기화합니다.
    const navigate = useNavigate();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const fetchMissingPersons = async () => {
            try {
                const params = {
                    pageNum: currentPage,
                    ...(searchFilters.missing_name && { missing_name: searchFilters.missing_name }),
                    ...(searchFilters.missing_situation && { missing_situation: searchFilters.missing_situation }),
                    ...(searchFilters.missing_extra_evidence && { missing_extra_evidence: searchFilters.missing_extra_evidence }),
                };
                
                const response = await axios.post('/api/posts/all_missing_search_missing', null, { params });
                const missingData = response.data.posts; 

                const transformedData = missingData.map(item => {
                    return {
                        id: item.mp_id,
                        originalImage: item.face_img_origin,
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
                console.error("Error fetching missing persons data:", error);
                setCardData([]);
            }
        };

        fetchMissingPersons();
    }, [currentPage, searchFilters]);

    const handlePageChange = (page) => {
        setSearchParams({ page: page });
    };

    const handleSearch = (filters) => {
        setSearchFilters(filters);
        setSearchParams({ page: 1 }); // 검색 시 첫 페이지로 이동
    };

    const handleFilterChange = (filters) => {
        setSearchFilters(filters);
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
                navigate('/missing-enrol');
            } else {
                // 7. 로그인 X -> 경고창 표시
                alert('로그인이 필요한 기능입니다.');
            }
        } catch (error) {
            // 8. API 호출 실패 시
            console.error("로그인 상태 확인 오류:", error);
            alert('로그인 상태를 확인하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.missingDescriptionGroup}>
                    <h1 className={styles.missingTitle}>실종자 찾기</h1>
                    <p className={styles.missingDescription}>실종자 본인이 등록한 실종자 게시판 입니다.</p>
                </div>
                <Searchbar 
                    onSearch={handleSearch}
                    searchFilters={searchFilters}
                    onFilterChange={handleFilterChange}
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
                        <MissingCard 
                            key={item.id}
                            id={item.id}
                            originalImage={getImageUrl(item.originalImage)}
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