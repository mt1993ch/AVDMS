import React, { useState } from 'react';
import { useTheme } from '../styles/theme';
import { validateAgniveerData } from '../utils/validation';

function AddAgniveer({ navigateTo }) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    trade: '', company: '', platoon: '', section: '', aro: '', education_qualification: '', email: '',
    class: '', class_composition: '', rural_urban: '', photo: null,
    // Personal Information
    batch_no: '',
    number: '',
    rank: '',
    name: '',
    civil_education: '',
    date_of_birth: '',
    date_of_enrolment: '',
    medical_category: '',
    date_of_training_commenced: '',
    
    // Identification
    account_number: '',
    pan_card_number: '',
    aadhar_card_number: '',
    identification_mark_1: '',
    identification_mark_2: '',
    
    // Home Address
    village: '',
    street: '',
    tehsil: '',
    post_office: '',
    police_station: '',
    district: '',
    state: '',
    pin_code: '',
    nearest_railway_station: '',
    
    // Next of Kin (NOK) Details
    nok_name: '',
    nok_relationship: '',
    nok_village: '',
    nok_tehsil: '',
    nok_post_office: '',
    nok_police_station: '',
    nok_district: '',
    nok_state: '',
    
    // Miscellaneous
    sports_played: '',
    hobbies: '',
    ncc: '',
    police_verification_status: 'Not Completed'
  });
  
  const [errors, setErrors] = useState({});
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === 'photo') {
        setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
        return;
    }
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
  
  // Handle form submission
  const handleSubmit = async (e) => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
    });
    const res = await fetch('/api/add-recruit', {
        method: 'POST',
        body: payload
    });
    const result = await res.json();
    if (result.success) {
        alert('Recruit added successfully');
    } else {
        alert('Failed to add recruit');
    }
    return;
};
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    // Validate form data
    const validationErrors = validateAgniveerData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      window.scrollTo(0, 0); // Scroll to top to show errors
      return;
    }
    
    try {
      // Submit data using electron API
      const result = await window.api.addAgniveer(formData);
      
      if (result.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          // Reset to initial state
          batch_no: '',
          number: '',
          rank: '',
          name: '',
          civil_education: '',
          date_of_birth: '',
          date_of_enrolment: '',
          medical_category: '',
          date_of_training_commenced: '',
          account_number: '',
          pan_card_number: '',
          aadhar_card_number: '',
          identification_mark_1: '',
          identification_mark_2: '',
          village: '',
          street: '',
          tehsil: '',
          post_office: '',
          police_station: '',
          district: '',
          state: '',
          pin_code: '',
          nearest_railway_station: '',
          nok_name: '',
          nok_relationship: '',
          nok_village: '',
          nok_tehsil: '',
          nok_post_office: '',
          nok_police_station: '',
          nok_district: '',
          nok_state: '',
          sports_played: '',
          hobbies: '',
          ncc: '',
          police_verification_status: 'Not Completed'
        });
        setIsSameAddress(false);
      } else {
        setSubmitError(result.message || 'Failed to add Agniveer. Please try again.');
      }
    } catch (err) {
      setSubmitError('An error occurred while saving data. Please try again.');
      console.error('Add Agniveer error:', err);
    } finally {
      setIsSubmitting(false);
      window.scrollTo(0, 0); // Scroll to top to show success/error message
    }
  };
  
  return (
    <div className="container-fluid py-3">
      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-outline-primary mb-3"
            onClick={() => navigateTo('home')}
          >
            <i data-feather="arrow-left" style={{ verticalAlign: 'middle', marginRight: '5px' }}></i>
            Back to Home
          </button>
          <h2 className="section-title">Add a New Agniveer</h2>
        </div>
      </div>
      
      {submitSuccess && (
        <div className="alert alert-success" role="alert">
          Agniveer information has been successfully added to the database.
        </div>
      )}
      
      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
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
                <label htmlFor="batch_no" className="form-label">Batch No.</label>
                <input
                  type="text"
                  className={`form-control ${errors.batch_no ? 'is-invalid' : ''}`}
                  id="batch_no"
                  name="batch_no"
                  value={formData.batch_no}
                  onChange={handleChange}
                />
                {errors.batch_no && <div className="invalid-feedback">{errors.batch_no}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="number" className="form-label">No.</label>
                <input
                  type="text"
                  className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                />
                {errors.number && <div className="invalid-feedback">{errors.number}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="rank" className="form-label">Rank</label>
                <input
                  type="text"
                  className={`form-control ${errors.rank ? 'is-invalid' : ''}`}
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                />
                {errors.rank && <div className="invalid-feedback">{errors.rank}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="civil_education" className="form-label">Civil Education</label>
                <input
                  type="text"
                  className={`form-control ${errors.civil_education ? 'is-invalid' : ''}`}
                  id="civil_education"
                  name="civil_education"
                  value={formData.civil_education}
                  onChange={handleChange}
                />
                {errors.civil_education && <div className="invalid-feedback">{errors.civil_education}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
                {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="date_of_enrolment" className="form-label">Date of Enrolment (DOE)</label>
                <input
                  type="date"
                  className={`form-control ${errors.date_of_enrolment ? 'is-invalid' : ''}`}
                  id="date_of_enrolment"
                  name="date_of_enrolment"
                  value={formData.date_of_enrolment}
                  onChange={handleChange}
                />
                {errors.date_of_enrolment && <div className="invalid-feedback">{errors.date_of_enrolment}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="medical_category" className="form-label">Medical Category</label>
                <input
                  type="text"
                  className={`form-control ${errors.medical_category ? 'is-invalid' : ''}`}
                  id="medical_category"
                  name="medical_category"
                  value={formData.medical_category}
                  onChange={handleChange}
                />
                {errors.medical_category && <div className="invalid-feedback">{errors.medical_category}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="date_of_training_commenced" className="form-label">Date of Training Commenced</label>
                <input
                  type="date"
                  className={`form-control ${errors.date_of_training_commenced ? 'is-invalid' : ''}`}
                  id="date_of_training_commenced"
                  name="date_of_training_commenced"
                  value={formData.date_of_training_commenced}
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
                <label htmlFor="account_number" className="form-label">Account Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.account_number ? 'is-invalid' : ''}`}
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                />
                {errors.account_number && <div className="invalid-feedback">{errors.account_number}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="pan_card_number" className="form-label">PAN Card Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.pan_card_number ? 'is-invalid' : ''}`}
                  id="pan_card_number"
                  name="pan_card_number"
                  value={formData.pan_card_number}
                  onChange={handleChange}
                />
                {errors.pan_card_number && <div className="invalid-feedback">{errors.pan_card_number}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="aadhar_card_number" className="form-label">Aadhar Card Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.aadhar_card_number ? 'is-invalid' : ''}`}
                  id="aadhar_card_number"
                  name="aadhar_card_number"
                  value={formData.aadhar_card_number}
                  onChange={handleChange}
                />
                {errors.aadhar_card_number && <div className="invalid-feedback">{errors.aadhar_card_number}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="identification_mark_1" className="form-label">Identification Mark (a)</label>
                <input
                  type="text"
                  className="form-control"
                  id="identification_mark_1"
                  name="identification_mark_1"
                  value={formData.identification_mark_1}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="identification_mark_2" className="form-label">Identification Mark (b)</label>
                <input
                  type="text"
                  className="form-control"
                  id="identification_mark_2"
                  name="identification_mark_2"
                  value={formData.identification_mark_2}
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
                <label htmlFor="village" className="form-label">Village (Vill.)</label>
                <input
                  type="text"
                  className={`form-control ${errors.village ? 'is-invalid' : ''}`}
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                />
                {errors.village && <div className="invalid-feedback">{errors.village}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="street" className="form-label">Street</label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="tehsil" className="form-label">Tehsil or Taluka Office (T.O.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="tehsil"
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="post_office" className="form-label">Post Office (P.O.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="post_office"
                  name="post_office"
                  value={formData.post_office}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="police_station" className="form-label">Police Station (P.S.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="police_station"
                  name="police_station"
                  value={formData.police_station}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="district" className="form-label">District (Dist.)</label>
                <input
                  type="text"
                  className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                />
                {errors.district && <div className="invalid-feedback">{errors.district}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  type="text"
                  className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="pin_code" className="form-label">PIN Code</label>
                <input
                  type="text"
                  className={`form-control ${errors.pin_code ? 'is-invalid' : ''}`}
                  id="pin_code"
                  name="pin_code"
                  value={formData.pin_code}
                  onChange={handleChange}
                />
                {errors.pin_code && <div className="invalid-feedback">{errors.pin_code}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="nearest_railway_station" className="form-label">Nearest Railway Station (NRS)</label>
                <input
                  type="text"
                  className="form-control"
                  id="nearest_railway_station"
                  name="nearest_railway_station"
                  value={formData.nearest_railway_station}
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
                <label htmlFor="nok_name" className="form-label">Name of NOK</label>
                <input
                  type="text"
                  className={`form-control ${errors.nok_name ? 'is-invalid' : ''}`}
                  id="nok_name"
                  name="nok_name"
                  value={formData.nok_name}
                  onChange={handleChange}
                />
                {errors.nok_name && <div className="invalid-feedback">{errors.nok_name}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_relationship" className="form-label">Relationship</label>
                <input
                  type="text"
                  className={`form-control ${errors.nok_relationship ? 'is-invalid' : ''}`}
                  id="nok_relationship"
                  name="nok_relationship"
                  value={formData.nok_relationship}
                  onChange={handleChange}
                />
                {errors.nok_relationship && <div className="invalid-feedback">{errors.nok_relationship}</div>}
              </div>
              
              <div className="col-12 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="same_address"
                    checked={isSameAddress}
                    onChange={handleSameAddressChange}
                  />
                  <label className="form-check-label" htmlFor="same_address">
                    Same as Permanent Address
                  </label>
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_village" className="form-label">Village (Vill.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="nok_village"
                  name="nok_village"
                  value={formData.nok_village}
                  onChange={handleChange}
                  disabled={isSameAddress}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_tehsil" className="form-label">Tehsil or Taluka Office (T.O.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="nok_tehsil"
                  name="nok_tehsil"
                  value={formData.nok_tehsil}
                  onChange={handleChange}
                  disabled={isSameAddress}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_post_office" className="form-label">Post Office (P.O.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="nok_post_office"
                  name="nok_post_office"
                  value={formData.nok_post_office}
                  onChange={handleChange}
                  disabled={isSameAddress}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_police_station" className="form-label">Police Station (P.S.)</label>
                <input
                  type="text"
                  className="form-control"
                  id="nok_police_station"
                  name="nok_police_station"
                  value={formData.nok_police_station}
                  onChange={handleChange}
                  disabled={isSameAddress}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_district" className="form-label">District</label>
                <input
                  type="text"
                  className="form-control"
                  id="nok_district"
                  name="nok_district"
                  value={formData.nok_district}
                  onChange={handleChange}
                  disabled={isSameAddress}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="nok_state" className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  id="nok_state"
                  name="nok_state"
                  value={formData.nok_state}
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
                <label htmlFor="sports_played" className="form-label">Sports Played & Level</label>
                <input
                  type="text"
                  className="form-control"
                  id="sports_played"
                  name="sports_played"
                  value={formData.sports_played}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="hobbies" className="form-label">Hobbies & Level</label>
                <input
                  type="text"
                  className="form-control"
                  id="hobbies"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="ncc" className="form-label">NCC (If Yes, Level)</label>
                <input
                  type="text"
                  className="form-control"
                  id="ncc"
                  name="ncc"
                  value={formData.ncc}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="police_verification_status" className="form-label">Police Verification Status</label>
                <select
                  className="form-select"
                  id="police_verification_status"
                  name="police_verification_status"
                  value={formData.police_verification_status}
                  onChange={handleChange}
                >
                  <option value="Completed">Completed</option>
                  <option value="Not Completed">Not Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
          <button
            type="button"
            className="btn btn-outline-secondary me-md-2"
            onClick={() => navigateTo('home')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAgniveer;
