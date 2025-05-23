import React, { useState, useEffect } from 'react';
import { useTheme } from '../styles/theme';
import { validateAgniveerData } from '../utils/validation';

function EditAgniveerModal({ agniveer, onClose, onSave }) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({...agniveer});
  const [errors, setErrors] = useState({});
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Check if addresses are the same on component mount
  useEffect(() => {
    const sameAddress = 
      agniveer.village === agniveer.nok_village &&
      agniveer.tehsil === agniveer.nok_tehsil &&
      agniveer.post_office === agniveer.nok_post_office &&
      agniveer.police_station === agniveer.nok_police_station &&
      agniveer.district === agniveer.nok_district &&
      agniveer.state === agniveer.nok_state;
    
    setIsSameAddress(sameAddress);
  }, [agniveer]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Handle checkbox for same address
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    
    if (checked) {
      // Copy home address to NOK address
      setFormData(prev => ({
        ...prev,
        nok_village: prev.village,
        nok_tehsil: prev.tehsil,
        nok_post_office: prev.post_office,
        nok_police_station: prev.police_station,
        nok_district: prev.district,
        nok_state: prev.state
      }));
    }
  };
  
  // Update NOK address fields when home address changes and same address is checked
  useEffect(() => {
    if (isSameAddress) {
      setFormData(prev => ({
        ...prev,
        nok_village: formData.village,
        nok_tehsil: formData.tehsil,
        nok_post_office: formData.post_office,
        nok_police_station: formData.police_station,
        nok_district: formData.district,
        nok_state: formData.state
      }));
    }
  }, [
    isSameAddress, 
    formData.village, 
    formData.tehsil, 
    formData.post_office, 
    formData.police_station, 
    formData.district, 
    formData.state
  ]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Validate form data
    const validationErrors = validateAgniveerData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit data using electron API
      const result = await window.api.updateAgniveer(formData);
      
      if (result.success) {
        onSave();
      } else {
        setSubmitError(result.message || 'Failed to update Agniveer data. Please try again.');
      }
    } catch (err) {
      setSubmitError('An error occurred while saving data. Please try again.');
      console.error('Edit Agniveer error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            <h5 className="modal-title">Edit Agniveer - {formData.name}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}
            
            {Object.keys(errors).length > 0 && (
              <div className="alert alert-danger">
                <h5>Please correct the following errors:</h5>
                <ul>
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Section 1: Personal Information */}
              <div className="card mb-4">
                <div className="card-header">
                  Personal Information
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="edit_batch_no" className="form-label">Batch No.</label>
                      <input
                        type="text"
                        className={`form-control ${errors.batch_no ? 'is-invalid' : ''}`}
                        id="edit_batch_no"
                        name="batch_no"
                        value={formData.batch_no || ''}
                        onChange={handleChange}
                      />
                      {errors.batch_no && <div className="invalid-feedback">{errors.batch_no}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_number" className="form-label">No.</label>
                      <input
                        type="text"
                        className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                        id="edit_number"
                        name="number"
                        value={formData.number || ''}
                        onChange={handleChange}
                      />
                      {errors.number && <div className="invalid-feedback">{errors.number}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_rank" className="form-label">Rank</label>
                      <input
                        type="text"
                        className={`form-control ${errors.rank ? 'is-invalid' : ''}`}
                        id="edit_rank"
                        name="rank"
                        value={formData.rank || ''}
                        onChange={handleChange}
                      />
                      {errors.rank && <div className="invalid-feedback">{errors.rank}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_name" className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="edit_name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_civil_education" className="form-label">Civil Education</label>
                      <input
                        type="text"
                        className={`form-control ${errors.civil_education ? 'is-invalid' : ''}`}
                        id="edit_civil_education"
                        name="civil_education"
                        value={formData.civil_education || ''}
                        onChange={handleChange}
                      />
                      {errors.civil_education && <div className="invalid-feedback">{errors.civil_education}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_date_of_birth" className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                        id="edit_date_of_birth"
                        name="date_of_birth"
                        value={formData.date_of_birth || ''}
                        onChange={handleChange}
                      />
                      {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_date_of_enrolment" className="form-label">Date of Enrolment</label>
                      <input
                        type="date"
                        className={`form-control ${errors.date_of_enrolment ? 'is-invalid' : ''}`}
                        id="edit_date_of_enrolment"
                        name="date_of_enrolment"
                        value={formData.date_of_enrolment || ''}
                        onChange={handleChange}
                      />
                      {errors.date_of_enrolment && <div className="invalid-feedback">{errors.date_of_enrolment}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_medical_category" className="form-label">Medical Category</label>
                      <input
                        type="text"
                        className={`form-control ${errors.medical_category ? 'is-invalid' : ''}`}
                        id="edit_medical_category"
                        name="medical_category"
                        value={formData.medical_category || ''}
                        onChange={handleChange}
                      />
                      {errors.medical_category && <div className="invalid-feedback">{errors.medical_category}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_date_of_training_commenced" className="form-label">Date of Training Commenced</label>
                      <input
                        type="date"
                        className={`form-control ${errors.date_of_training_commenced ? 'is-invalid' : ''}`}
                        id="edit_date_of_training_commenced"
                        name="date_of_training_commenced"
                        value={formData.date_of_training_commenced || ''}
                        onChange={handleChange}
                      />
                      {errors.date_of_training_commenced && <div className="invalid-feedback">{errors.date_of_training_commenced}</div>}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 2: Identification */}
              <div className="card mb-4">
                <div className="card-header">
                  Identification
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="edit_account_number" className="form-label">Account Number</label>
                      <input
                        type="text"
                        className={`form-control ${errors.account_number ? 'is-invalid' : ''}`}
                        id="edit_account_number"
                        name="account_number"
                        value={formData.account_number || ''}
                        onChange={handleChange}
                      />
                      {errors.account_number && <div className="invalid-feedback">{errors.account_number}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_pan_card_number" className="form-label">PAN Card Number</label>
                      <input
                        type="text"
                        className={`form-control ${errors.pan_card_number ? 'is-invalid' : ''}`}
                        id="edit_pan_card_number"
                        name="pan_card_number"
                        value={formData.pan_card_number || ''}
                        onChange={handleChange}
                      />
                      {errors.pan_card_number && <div className="invalid-feedback">{errors.pan_card_number}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_aadhar_card_number" className="form-label">Aadhar Card Number</label>
                      <input
                        type="text"
                        className={`form-control ${errors.aadhar_card_number ? 'is-invalid' : ''}`}
                        id="edit_aadhar_card_number"
                        name="aadhar_card_number"
                        value={formData.aadhar_card_number || ''}
                        onChange={handleChange}
                      />
                      {errors.aadhar_card_number && <div className="invalid-feedback">{errors.aadhar_card_number}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_identification_mark_1" className="form-label">Identification Mark (a)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_identification_mark_1"
                        name="identification_mark_1"
                        value={formData.identification_mark_1 || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_identification_mark_2" className="form-label">Identification Mark (b)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_identification_mark_2"
                        name="identification_mark_2"
                        value={formData.identification_mark_2 || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 3: Home Address */}
              <div className="card mb-4">
                <div className="card-header">
                  Home Address
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="edit_village" className="form-label">Village (Vill.)</label>
                      <input
                        type="text"
                        className={`form-control ${errors.village ? 'is-invalid' : ''}`}
                        id="edit_village"
                        name="village"
                        value={formData.village || ''}
                        onChange={handleChange}
                      />
                      {errors.village && <div className="invalid-feedback">{errors.village}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_street" className="form-label">Street</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_street"
                        name="street"
                        value={formData.street || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_tehsil" className="form-label">Tehsil or Taluka Office (T.O.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_tehsil"
                        name="tehsil"
                        value={formData.tehsil || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_post_office" className="form-label">Post Office (P.O.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_post_office"
                        name="post_office"
                        value={formData.post_office || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_police_station" className="form-label">Police Station (P.S.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_police_station"
                        name="police_station"
                        value={formData.police_station || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_district" className="form-label">District (Dist.)</label>
                      <input
                        type="text"
                        className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                        id="edit_district"
                        name="district"
                        value={formData.district || ''}
                        onChange={handleChange}
                      />
                      {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_state" className="form-label">State</label>
                      <input
                        type="text"
                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                        id="edit_state"
                        name="state"
                        value={formData.state || ''}
                        onChange={handleChange}
                      />
                      {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_pin_code" className="form-label">PIN Code</label>
                      <input
                        type="text"
                        className={`form-control ${errors.pin_code ? 'is-invalid' : ''}`}
                        id="edit_pin_code"
                        name="pin_code"
                        value={formData.pin_code || ''}
                        onChange={handleChange}
                      />
                      {errors.pin_code && <div className="invalid-feedback">{errors.pin_code}</div>}
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="edit_nearest_railway_station" className="form-label">Nearest Railway Station (NRS)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nearest_railway_station"
                        name="nearest_railway_station"
                        value={formData.nearest_railway_station || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 4: Next of Kin (NOK) Details */}
              <div className="card mb-4">
                <div className="card-header">
                  Next of Kin (NOK) Details
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_name" className="form-label">Name of NOK</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nok_name ? 'is-invalid' : ''}`}
                        id="edit_nok_name"
                        name="nok_name"
                        value={formData.nok_name || ''}
                        onChange={handleChange}
                      />
                      {errors.nok_name && <div className="invalid-feedback">{errors.nok_name}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_relationship" className="form-label">Relationship</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nok_relationship ? 'is-invalid' : ''}`}
                        id="edit_nok_relationship"
                        name="nok_relationship"
                        value={formData.nok_relationship || ''}
                        onChange={handleChange}
                      />
                      {errors.nok_relationship && <div className="invalid-feedback">{errors.nok_relationship}</div>}
                    </div>
                    
                    <div className="col-12 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="edit_same_address"
                          checked={isSameAddress}
                          onChange={handleSameAddressChange}
                        />
                        <label className="form-check-label" htmlFor="edit_same_address">
                          Same as Permanent Address
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_village" className="form-label">Village (Vill.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nok_village"
                        name="nok_village"
                        value={formData.nok_village || ''}
                        onChange={handleChange}
                        disabled={isSameAddress}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_tehsil" className="form-label">Tehsil or Taluka Office (T.O.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nok_tehsil"
                        name="nok_tehsil"
                        value={formData.nok_tehsil || ''}
                        onChange={handleChange}
                        disabled={isSameAddress}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_post_office" className="form-label">Post Office (P.O.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nok_post_office"
                        name="nok_post_office"
                        value={formData.nok_post_office || ''}
                        onChange={handleChange}
                        disabled={isSameAddress}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_police_station" className="form-label">Police Station (P.S.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nok_police_station"
                        name="nok_police_station"
                        value={formData.nok_police_station || ''}
                        onChange={handleChange}
                        disabled={isSameAddress}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_district" className="form-label">District</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nok_district"
                        name="nok_district"
                        value={formData.nok_district || ''}
                        onChange={handleChange}
                        disabled={isSameAddress}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_nok_state" className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_nok_state"
                        name="nok_state"
                        value={formData.nok_state || ''}
                        onChange={handleChange}
                        disabled={isSameAddress}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 5: Miscellaneous */}
              <div className="card mb-4">
                <div className="card-header">
                  Miscellaneous
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="edit_sports_played" className="form-label">Sports Played & Level</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_sports_played"
                        name="sports_played"
                        value={formData.sports_played || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_hobbies" className="form-label">Hobbies & Level</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_hobbies"
                        name="hobbies"
                        value={formData.hobbies || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_ncc" className="form-label">NCC (If Yes, Level)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit_ncc"
                        name="ncc"
                        value={formData.ncc || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="edit_police_verification_status" className="form-label">Police Verification Status</label>
                      <select
                        className="form-select"
                        id="edit_police_verification_status"
                        name="police_verification_status"
                        value={formData.police_verification_status || 'Not Completed'}
                        onChange={handleChange}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Not Completed">Not Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAgniveerModal;
