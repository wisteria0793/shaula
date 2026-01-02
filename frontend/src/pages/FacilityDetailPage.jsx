import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FacilityForm from '../components/FacilityForm';
import '../styles/FacilityDetailsPage.css';

function FacilityDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    // 全アメニティのリストを保持するStateを追加
    const [allAmenities, setAllAmenities] = useState([]);

    const fetchFacilityData = async () => {
        setLoading(true);
        try {
            const [facilityRes, amenitiesRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/amenities/`)
            ]);

            if (!facilityRes.ok) throw new Error('施設の詳細取得に失敗しました。');
            if (!amenitiesRes.ok) throw new Error('アメニティ一覧の取得に失敗しました。');

            const facilityData = await facilityRes.json();
            const amenitiesData = await amenitiesRes.json();
            
            setFacility(facilityData);
            setAllAmenities(amenitiesData);
            // フォームデータのアメニティは、オブジェクトの配列ではなくIDの配列として保持
            setFormData({
                ...facilityData,
                amenities: facilityData.amenities.map(a => a.id)
            });

        } catch (err) {
            console.error('API Error (データ取得):', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 施設データと全アメニティリストを並行して取得
    useEffect(() => {
        fetchFacilityData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // アメニティのチェックボックス変更ハンドラを追加
    const handleAmenityChange = (amenityId) => {
        setFormData(prev => {
            const newAmenities = new Set(prev.amenities);
            if (newAmenities.has(amenityId)) {
                newAmenities.delete(amenityId);
            } else {
                newAmenities.add(amenityId);
            }
            return { ...prev, amenities: Array.from(newAmenities) };
        });
    };
    
    // handleUpdateのpayloadにamenitiesを追加
        const handleUpdate = async (e) => {
            e.preventDefault();
            setFormErrors({});
            const payload = {
                facility_name: formData.facility_name,
                capacity: formData.capacity,
                address: formData.address,
                description: formData.description,
                amenities: formData.amenities, // アメニティIDの配列を追加
            };
    
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || '施設の更新に失敗しました。');
                }
                
                alert('施設情報が更新されました！');
                navigate('/'); // トップページにリダイレクト
    
            } catch (err) {
                console.error('API Error (更新):', err);
                setError(err.message);
            }
        };
        
        // (handleDelete, 画像管理関数などは変更なし)
        const handleDelete = async(e) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });
                if (!response.ok) {
                    throw new Error('施設の削除に失敗しました');
                }
                alert('施設を削除しました。');
                navigate('/'); // トップページにリダイレクト
            }  catch (err) {
                console.error('API Error (削除):', err);
                setError(err.message)
            }
        };
    
    
        // --- メインレンダリング ---
        if (loading) return <div>ローディング中...</div>;
        if (error) return <div>エラー: {error}</div>;
        if (!facility) return <div>施設が見つかりません。</div>;
    
    
        return (
            <div>
                <h1>施設詳細: {facility.facility_name}</h1>
    
                <FacilityForm
                    formData={formData}
                    formErrors={formErrors}
                    onFormChange={handleInputChange}
                    onFormSubmit={handleUpdate}
                    submitButtonText="保存"
                    onCancel={() => navigate(-1)} // 前のページに戻る
                />
                        
                {/* アメニティ編集セクション */}
                <div className="edit-section">
                    <h2>アメニティ管理</h2>
                    <div className="amenity-checkbox-group">
                        {allAmenities.map(amenity => (
                            <div key={amenity.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.id)}
                                        onChange={() => handleAmenityChange(amenity.id)}
                                    />
                                    {amenity.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* 画像管理セクション */}
                <div className="edit-section">
                    <h2>画像管理</h2>
                    {/* ... (画像管理のJSX) ... */}
                </div>
                
                <div className="delete-section">
                    <button onClick={handleDelete} className="delete-button">この施設を削除</button>
                </div>
            </div>
        );
    }
    
    export default FacilityDetailsPage;
