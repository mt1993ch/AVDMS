import React from 'react';
import { useTheme } from '../styles/theme';

function ViewAgniveerModal({ agniveer, onClose }) {
  const { colors } = useTheme();
  
  // Helper function to format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Create field groups for organized display
  const personalInfo = [
    { label: 'Batch No.', value: agniveer.batch_no },
    { label: 'No.', value: agniveer.number },
    { label: 'Rank', value: agniveer.rank },
    { label: 'Name', value: agniveer.name },
    { label: 'Civil Education', value: agniveer.civil_education },
    { label: 'Date of Birth', value: formatDate(agniveer.date_of_birth) },
    { label: 'Date of Enrolment (DOE)', value: formatDate(agniveer.date_of_enrolment) },
    { label: 'Medical Category', value: agniveer.medical_category },
    { label: 'Date of Training Commenced', value: formatDate(agniveer.date_of_training_commenced) }
  ];
  
  const identificationInfo = [
    { label: 'Account Number', value: agniveer.account_number },
    { label: 'PAN Card Number', value: agniveer.pan_card_number },
    { label: 'Aadhar Card Number', value: agniveer.aadhar_card_number },
    { label: 'Identification Mark (a)', value: agniveer.identification_mark_1 },
    { label: 'Identification Mark (b)', value: agniveer.identification_mark_2 }
  ];
  
  const addressInfo = [
    { label: 'Village (Vill.)', value: agniveer.village },
    { label: 'Street', value: agniveer.street },
    { label: 'Tehsil or Taluka Office (T.O.)', value: agniveer.tehsil },
    { label: 'Post Office (P.O.)', value: agniveer.post_office },
    { label: 'Police Station (P.S.)', value: agniveer.police_station },
    { label: 'District (Dist.)', value: agniveer.district },
    { label: 'State', value: agniveer.state },
    { label: 'PIN Code', value: agniveer.pin_code },
    { label: 'Nearest Railway Station (NRS)', value: agniveer.nearest_railway_station }
  ];
  
  const nokInfo = [
    { label: 'Name of NOK', value: agniveer.nok_name },
    { label: 'Relationship', value: agniveer.nok_relationship },
    { label: 'Village (Vill.)', value: agniveer.nok_village },
    { label: 'Tehsil or Taluka Office (T.O.)', value: agniveer.nok_tehsil },
    { label: 'Post Office (P.O.)', value: agniveer.nok_post_office },
    { label: 'Police Station (P.S.)', value: agniveer.nok_police_station },
    { label: 'District', value: agniveer.nok_district },
    { label: 'State', value: agniveer.nok_state }
  ];
  
  const miscInfo = [
    { label: 'Sports Played & Level', value: agniveer.sports_played },
    { label: 'Hobbies & Level', value: agniveer.hobbies },
    { label: 'NCC (If Yes, Level)', value: agniveer.ncc },
    { label: 'Police Verification Status', value: agniveer.police_verification_status }
  ];
  
  // Helper function to render information sections
  const renderInfoSection = (title, fields) => (
    <div className="card mb-3">
      <div className="card-header" style={{ backgroundColor: colors.primary, color: '#fff' }}>
        {title}
      </div>
      <div className="card-body">
        <div className="row">
          {fields.map((field, index) => (
            <div key={index} className="col-md-6 mb-2">
              <div className="d-flex">
                <strong className="me-2" style={{ minWidth: '160px' }}>{field.label}:</strong>
                <span>{field.value || 'Not specified'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            <h5 className="modal-title">Agniveer Details - {agniveer.name}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {renderInfoSection('Personal Information', personalInfo)}
            {renderInfoSection('Identification', identificationInfo)}
            {renderInfoSection('Home Address', addressInfo)}
            {renderInfoSection('Next of Kin (NOK) Details', nokInfo)}
            {renderInfoSection('Miscellaneous', miscInfo)}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAgniveerModal;
