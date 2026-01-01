import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // URLパラメータとナビゲーション用

function FacilityDetailsPage() {
    const {id} = useParams();   // URLから施設のIDを取得
    const navigate = useNavigate(); // ページ遷移のために使用
    
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});   // 編集フォームのデータ

    // 施設データのフェッチ
    useEffect(() => {
        const fetchFacility = async () => {
            try{
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`);
                if (!response.ok){
                    throw new Error('施設の詳細取得に失敗しました。');
                }
                const data = await response.json();
                setFacility(data);
                setFormData(data);
            } catch (err){
                console.error('API Error (詳細取得):', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFacility();
    }, [id]); // idが変わるたびに再度フェッチ

    // フォーム入力値の変更ハンドラ
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // 施設の更新ハンドラ
    const handleUpdate = async () => {
        // 更新可能なフィールドだけを抽出したペイロードを作成
        const payload = {
            facility_name: formData.facility_name,
            capacity: formData.capacity,
            address: formData.address,
            description: formData.description,
            short_description: formData.short_description,
            num_parking: formData.num_parking,
            map_url: formData.map_url,
            management_entity: formData.management_entity,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // 修正されたペイロードを送信
            });

            if (!response.ok) {
                // エラーレスポンスをテキストとして読み取り、より詳細な情報を表示
                const errorText = await response.text();
                throw new Error(`更新に失敗しました: ${response.status} ${errorText}`);
            }

            const updatedData = await response.json();
            setFacility(updatedData);
            setIsEditing(false);
            alert('施設情報が更新されました！');

        } catch (err) {
            console.error('API Error (更新):', err);
            setError(err.message);
            alert(`更新エラー: ${err.message}`);
        }
    };

    // 施設の削除ハンドラ
    const handleDelete = async() => {
        if (!window.confirm('この施設を削除しますか')){
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok){
                throw new Error('施設の削除に失敗しました');
            }

            alert('施設が削除されました');
            navigate('/') // 削除後、一覧ページに戻る

        } catch (err) {
            console.error('API Error (削除):', err);
            setError(err.message);
            alert(`削除エラー:${err.message}`);
        }
    };

    if (loading) return <div>ローディング中...</div>
    if (error) return <div>エラー: {error}</div>
    if (!facility) return <div>施設が見つかりません</div>;

    return (
        <div>
            <h1>施設詳細: {facility.facility_name}</h1>

            {isEditing ? (
                // 編集モード
                <div>
                    <label>
                        施設名:
                        <input type="text" name="facility_name" value={formData.facility_name || ''} onChange={handleInputChange} /> 
                    </label>
                    <br />
                    <label>
                        最大宿泊人数:
                        <input type="number" name="capacity" value={formData.capacity || ''} onChange={handleInputChange} /> 
                    </label>
                    <br />
                    <label>
                        住所:
                        <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} /> 
                    </label>
                    <br />

                    {/*  */}
                    <button onClick={handleUpdate}>保存</button>
                    <button onClick={() => setIsEditing(false)}>キャンセル</button>

                </div>
            ) : (
                // 表示モード
                <div>
                    <p><strong>施設名:</strong> {facility.facility_name}</p>
                    <p><strong>最大宿泊人数:</strong> {facility.capacity}</p>
                    <p><strong>住所:</strong> {facility.address}</p>

                    <button onClick={() => setIsEditing(true)}>編集</button>
                    <button onClick={handleDelete} style={{marginLeft:'10px', backgroundColor: 'red', color: 'white'}}>削除</button>
                </div>
            )}
            <br />
            <button onClick={() => navigate('/')}>一覧に戻る</button>
        </div>
    );
}
export default FacilityDetailsPage