import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityForm from '../components/FacilityForm'; // 汎用フォームをインポート

function FacilityCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        facility_name: '',
        capacity: 1,
        address: '',
        description: '',
        short_description: '',
        num_parking: 0,
        map_url: '',
        prop_key: '',
        room_key: '',
    });

    const [formErrors, setFormErrors] = useState({});
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    const friendlyErrors = {};
                    for (const field in responseData) {
                        if (field === 'capacity') {
                            friendlyErrors.capacity = '最大宿泊人数は1以上20以下の値を入力してください';
                        } else if (field === 'facility_name') {
                            friendlyErrors.facility_name = '施設名は必須です。';
                        } else {
                            friendlyErrors[field] = '無効な値です。';
                        }
                    }
                    setFormErrors(friendlyErrors);
                } else {
                    throw new Error(`作成サーバエラー: ${response.status}`);
                }
                return;
            }

            alert('新しい施設が作成されました。');
            navigate(`/facilities/${responseData.id}`);
        } catch (err) {
            console.error('API Error (作成):', err);
            alert(`作成処理中にエラーが発生しました: ${err.message}`);
        }
    };

    return (
        <div>
            <h1>新規施設作成</h1>
            <FacilityForm
                formData={formData}
                formErrors={formErrors}
                onFormChange={handleInputChange}
                onFormSubmit={handleSubmit}
                submitButtonText="作成"
                onCancel={() => navigate('/')}
            />
        </div>
    );
}

export default FacilityCreatePage;