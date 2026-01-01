import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import FacilityPage from './pages/FacilityPage';
import FacilityDetailsPage from './pages/FacilityDetailsPage';
import './App.css'


function App() {

  return (
    <>
      <div>
        <Routes>
          {/* ルートURL('/')にアクセサ売れたらFacilityPageを表示 */}
          <Route path="/" element={<FacilityPage />} />

          {/* /facilities/:id という形式のURLにアクセスされたらFacilityDetailPageを表示 */}
          <Route path="/facilities/:id" element={<FacilityDetailsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;