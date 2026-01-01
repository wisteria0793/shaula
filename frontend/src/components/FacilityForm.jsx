import React from 'react';

function FacilityForm({ formData, formErrors, onFormChange, onFormSubmit, submitButtonText, onCancel }) {
    return (
        <form onSubmit={onFormSubmit} className="edit-form">
            <div className="form-group">
                <label>施設名:</label>
                <input type="text" name="facility_name" value={formData.facility_name || ''} onChange={onFormChange} required />
                {formErrors.facility_name && <span className="error-message">{formErrors.facility_name}</span>}
            </div>
            <div className="form-group">
                <label>最大宿泊人数:</label>
                <input type="number" name="capacity" value={formData.capacity || ''} onChange={onFormChange} required />
                {formErrors.capacity && <span className="error-message">{formErrors.capacity}</span>}
            </div>
            <div className="form-group">
                <label>住所:</label>
                <input type="text" name="address" value={formData.address || ''} onChange={onFormChange} required />
                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
            </div>
            <div className="form-group">
                <label>説明文:</label>
                <textarea name="description" value={formData.description || ''} onChange={onFormChange} rows="4"></textarea>
                {formErrors.description && <span className="error-message">{formErrors.description}</span>}
            </div>
            <div className="form-group">
                <label>短い説明文:</label>
                <input type="text" name="short_description" value={formData.short_description || ''} onChange={onFormChange} />
                {formErrors.short_description && <span className="error-message">{formErrors.short_description}</span>}
            </div>
            <div className="form-group">
                <label>駐車台数:</label>
                <input type="number" name="num_parking" value={formData.num_parking || ''} onChange={onFormChange} />
                {formErrors.num_parking && <span className="error-message">{formErrors.num_parking}</span>}
            </div>
            <div className="form-group">
                <label>Google Map URL:</label>
                <input type="url" name="map_url" value={formData.map_url || ''} onChange={onFormChange} />
                {formErrors.map_url && <span className="error-message">{formErrors.map_url}</span>}
            </div>
            <div className="form-group">
                <label>プロパティキー (Beds24):</label>
                <input type="text" name="prop_key" value={formData.prop_key || ''} onChange={onFormChange} />
                {formErrors.prop_key && <span className="error-message">{formErrors.prop_key}</span>}
            </div>
            <div className="form-group">
                <label>ルームキー (Beds24):</label>
                <input type="text" name="room_key" value={formData.room_key || ''} onChange={onFormChange} />
                {formErrors.room_key && <span className="error-message">{formErrors.room_key}</span>}
            </div>

            <div className="actions-container">
                <button type="submit">{submitButtonText}</button>
                {onCancel && <button type="button" onClick={onCancel}>キャンセル</button>}
            </div>
        </form>
    );
}

export default FacilityForm;