import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FamilyPage from './pages/FamilyPage';
import MissingPage from './pages/MissingPage';
import FaceSimilarityPage from './pages/FaceSimilarityPage';
import MultimodalSearchPage from './pages/MultimodalSearchPage';
import MissingEnrolPage from './pages/MissingEnrolPage';
import FamilyEnrolPage from './pages/FamilyEnrolPage';
import MissingDetailPage from './pages/MissingDetailPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/missing" element={<MissingPage />} />
        <Route path="/missing/:missingId" element={<MissingDetailPage />} />
        <Route path="/face-similarity" element={<FaceSimilarityPage />} />
        <Route path="/multimodal-search" element={<MultimodalSearchPage />} />
        <Route path="/missing-enrol" element={<MissingEnrolPage />} />
        <Route path="/family-enrol" element={<FamilyEnrolPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
