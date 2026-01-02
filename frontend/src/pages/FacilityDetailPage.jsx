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
    const [newAmenity, setNewAmenity] = useState(''); // 新規アメニティ入力用のState

    // Image States
    const [selectedImage, setSelectedImage] = useState(null);

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

    useEffect(() => {
        fetchFacilityData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // アメニティハンドラ
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

    const handleNewAmenityChange = (e) => {
        setNewAmenity(e.target.value);
    };

    const handleAmenitySubmit = async (e) => {
        e.preventDefault();
        if (!newAmenity.trim()) {
            return alert('アメニティ名を入力してください。');
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/amenities/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newAmenity }),
            });
            if (!response.ok) {
                // 既に存在する場合などのエラーハンドリング
                const errorData = await response.json();
                if (errorData.name && errorData.name.some(err => err.includes('unique'))) {
                    alert('このアメニティは既に存在します。');
                } else {
                    throw new Error('アメニティの追加に失敗しました。');
                }
            } else {
                setNewAmenity(''); // 入力欄をクリア
                await fetchFacilityData(); // アメニティリストと施設情報を再取得してUIを更新
                alert('新しいアメニティを追加しました。');
            }
        } catch (err) {
            console.error('API Error (アメニティ追加):', err);
            setError(err.message);
        }
    };

    // 画像ハンドラ
    const handleImageSelect = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return alert('画像ファイルを選択してください');

        const imagePayload = new FormData();
        imagePayload.append('facility', id);
        imagePayload.append('image', selectedImage);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/images/`, {
                method: 'POST',
                body: imagePayload,
            });

            if (!response.ok) throw new Error('画像のアップロードに失敗しました');

            setSelectedImage(null); // リセット
            await fetchFacilityData();
            alert('画像がアップロードされました');
        } catch (err) {
            console.error('API ERROR (画像アップロード):', err);
            setError(err.message);
        }
    };

    const handleImageDelete = async (imageId) => {
        if (!window.confirm('この画像を削除しますか？')) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/images/${imageId}/`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('画像の削除に失敗しました');

            await fetchFacilityData();
            alert('画像を削除しました');
        } catch (err) {
            console.error('API Error (画像削除):', err);
            setError(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormErrors({});
        const payload = {
            ...formData,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '施設の更新に失敗しました');
            }

            alert('施設情報が更新されました');
            navigate('/');
        } catch (err) {
            console.error('API Error (更新):', err);
            setError(err.message);
        }
    };

    
    const handleDelete = async() => {
        if (!window.confirm(
            '施設を削除しますか？'
        )) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('施設の削除に失敗しました');
            }
            alert('施設を削除しました');
            navigate('/');
        } catch (err) {
            console.error('API Error (削除):', err);
            setError(err.message)
        }
    };

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
                onCancel={() => navigate(-1)}
            />
                    
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
                <div className="add-amenity-form">
                    <form onSubmit={handleAmenitySubmit}>
                        <input
                            type="text"
                            value={newAmenity}
                            onChange={handleNewAmenityChange}
                            placeholder="新しいアメニティ名"
                        />
                        <button type="submit">アメニティを追加</button>
                    </form>
                </div>
            </div>

            <div className="edit-section">
                <h2>画像管理</h2>
                {/* 画像管理機能は次のステップで実装 */}
                <div className="image-list">
                    {facility.images && facility.images.map( image => (
                        <div key={image.id} className="image-item">
                            <img src={image.image} alt={image.caption || '施設画像'} style={{ width: '150px', height: 'auto' }} />
                            <button onClick={() => handleImageDelete(image.id)}>削除</button>
                        </div>
                    ))}
                </div>

                <div className="add-image-form">
                    <input type="file" onChange={handleImageSelect} accept="image/*" />
                    <button onClick={handleImageUpload}>アップロード</button>
                </div>
            </div>
            
            <div className="delete-section">
                <button onClick={handleDelete} className="delete-button">この施設を削除</button>
            </div>
        </div>
    );
}
export default FacilityDetailsPage;