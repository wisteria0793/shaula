import { Routes, Route } from 'react-router-dom';
import FacilityPage from './pages/FacilityPage';
import FacilityDetailPage from './pages/FacilityDetailPage';
import FacilityCreatePage from './pages/FacilityCreatePage'; // 新しくインポート
import './App.css';


function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* ルートURL ('/') にアクセスされたらFacilityPageを表示 */}
        <Route path="/" element={<FacilityPage />} />
        
        {/* 新規作成ページへのルートを追加 */}
        <Route path="/facilities/new" element={<FacilityCreatePage />} />
        
        {/* '/facilities/:id' という形式のURLにアクセスされたらFacilityDetailPageを表示 */}
        <Route path="/facilities/:id" element={<FacilityDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;