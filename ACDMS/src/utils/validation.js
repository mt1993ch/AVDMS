/**
 * Utility functions for validating Agniveer data
 */

// Validate Agniveer form data
export const validateAgniveerData = (data) => {
  const errors = {};
  
  // Required fields validation
  const requiredFields = {
    batch_no: 'Batch No. is required',
    number: 'No. is required',
    rank: 'Rank is required',
    name: 'Name is required',
    date_of_birth: 'Date of Birth is required',
    date_of_enrolment: 'Date of Enrolment is required',
    medical_category: 'Medical Category is required',
    village: 'Village is required',
    district: 'District is required',
    state: 'State is required',
    pin_code: 'PIN Code is required',
    nok_name: 'Next of Kin Name is required',
    nok_relationship: 'Next of Kin Relationship is required'
  };
  
  // Check required fields
  for (const [field, message] of Object.entries(requiredFields)) {
    if (!data[field] || data[field].trim() === '') {
      errors[field] = message;
    }
  }
  
  // Name validation - alphabets, spaces, and some special characters
  if (data.name && !/^[A-Za-z\s.'-]+$/.test(data.name)) {
    errors.name = 'Name should contain only alphabets, spaces, and common name characters';
  }
  
  // PIN Code validation - 6 digits
  if (data.pin_code && !/^\d{6}$/.test(data.pin_code.trim())) {
    errors.pin_code = 'PIN Code must be 6 digits';
  }
  
  // Aadhar Card validation - 12 digits
  if (data.aadhar_card_number && !/^\d{12}$/.test(data.aadhar_card_number.trim())) {
    errors.aadhar_card_number = 'Aadhar Card Number must be 12 digits';
  }
  
  // PAN Card validation - 10 alphanumeric characters
  if (data.pan_card_number && !/^[A-Z0-9]{10}$/.test(data.pan_card_number.trim())) {
    errors.pan_card_number = 'PAN Card Number must be 10 alphanumeric characters';
  }
  
  // Date validations
  const today = new Date();
  
  // Date of Birth - not in future and not too old (100 years)
  if (data.date_of_birth) {
    const dob = new Date(data.date_of_birth);
    if (dob > today) {
      errors.date_of_birth = 'Date of Birth cannot be in the future';
    } else if (today.getFullYear() - dob.getFullYear() > 100) {
      errors.date_of_birth = 'Date of Birth seems too old';
    }
  }
  
  // Date of Enrolment - not in future
  if (data.date_of_enrolment) {
    const doe = new Date(data.date_of_enrolment);
    if (doe > today) {
      errors.date_of_enrolment = 'Date of Enrolment cannot be in the future';
    }
  }
  
  // Date of Training Commenced - not in future
  if (data.date_of_training_commenced) {
    const dotc = new Date(data.date_of_training_commenced);
    if (dotc > today) {
      errors.date_of_training_commenced = 'Date of Training Commenced cannot be in the future';
    }
  }
  
  // Check relationship between dates
  if (data.date_of_birth && data.date_of_enrolment) {
    const dob = new Date(data.date_of_birth);
    const doe = new Date(data.date_of_enrolment);
    
    // Age at enrolment should be at least 17 years
    const ageAtEnrolment = (doe.getFullYear() - dob.getFullYear());
    if (ageAtEnrolment < 17) {
      errors.date_of_enrolment = 'Recruit must be at least 17 years old at enrolment';
    }
  }
  
  return errors;
};

// Validate search filters
export const validateSearchFilters = (filters) => {
  const errors = {};
  
  // Check that at least one filter is provided
  const hasFilters = Object.values(filters).some(value => value && value.trim() !== '');
  if (!hasFilters) {
    errors.general = 'Please provide at least one search criterion';
  }
  
  return errors;
};

// Utility function to check if any object has empty properties
export const hasEmptyRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      return true;
    }
  }
  return false;
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  return Object.values(errors).join(', ');
};
