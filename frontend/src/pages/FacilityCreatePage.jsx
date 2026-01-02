import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityForm from '../components/FacilityForm';

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
        amenities: [], // amenitiesを空の配列で初期化
    });
    const [formErrors, setFormErrors] = useState({});

    // Amenity and Image states
    const [allAmenities, setAllAmenities] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    // Fetch all amenities on component mount
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/amenities/`);
                if (!response.ok) {
                    throw new Error('アメニティ一覧の取得に失敗しました。');
                }
                const data = await response.json();
                setAllAmenities(data);
            } catch (error) {
                console.error("API Error (Amenities):", error);
                setFormErrors(prev => ({ ...prev, amenities: error.message }));
            }
        };
        fetchAmenities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

    const handleImageSelect = (e) => {
        setSelectedImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        // 1. Create facility with basic info first
        const { amenities, ...basicFormData } = formData;
        let newFacilityId;

        try {
            const facilityResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(basicFormData),
            });

            const facilityData = await facilityResponse.json();
            if (!facilityResponse.ok) {
                // Handle basic info validation errors
                if (facilityResponse.status === 400) {
                    setFormErrors(facilityData);
                } else {
                    throw new Error(`施設の基本情報の作成に失敗しました: ${facilityResponse.statusText}`);
                }
                return; // Stop if facility creation fails
            }
            newFacilityId = facilityData.id;

            // 2. Update amenities if any are selected
            if (amenities.length > 0) {
                const amenityResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/${newFacilityId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amenities: amenities }),
                });
                if (!amenityResponse.ok) {
                    throw new Error('アメニティ情報の更新に失敗しました。');
                }
            }

            // 3. Upload images if any are selected
            if (selectedImages.length > 0) {
                const uploadPromises = selectedImages.map(imageFile => {
                    const imagePayload = new FormData();
                    imagePayload.append('facility', newFacilityId);
                    imagePayload.append('image', imageFile);

                    return fetch(`${import.meta.env.VITE_API_BASE_URL}/images/`, {
                        method: 'POST',
                        body: imagePayload,
                    });
                });

                const responses = await Promise.all(uploadPromises);
                const failedUploads = responses.filter(res => !res.ok);
                if (failedUploads.length > 0) {
                    throw new Error(`${failedUploads.length}件の画像のアップロードに失敗しました。`);
                }
            }

            // 4. All done, navigate to the new facility's page
            alert('新しい施設が正常に作成されました。');
            navigate('/');

        } catch (err) {
            console.error('API Error (作成プロセス全体):', err);
            // Inform user that something went wrong in the multi-step process
            alert(`作成処理中にエラーが発生しました: ${err.message}\n施設情報が不完全な状態で作成された可能性があります。`);
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

            <div className="edit-section">
                <h2>アメニティ</h2>
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

            <div className="edit-section">
                <h2>画像</h2>
                <div className="add-image-form">
                    <input type="file" onChange={handleImageSelect} accept="image/*" multiple />
                </div>
            </div>

        </div>
    );
}

export default FacilityCreatePage;