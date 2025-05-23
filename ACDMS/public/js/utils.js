/**
 * Utility functions for the ACDMS application
 */

// Format date for display (DD MMM YYYY)
function formatDate(dateString) {
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
}

// Show an element by removing the 'd-none' class
function showElement(element) {
  if (typeof element === 'string') {
    element = document.getElementById(element);
  }
  if (element) {
    element.classList.remove('d-none');
  }
}

// Hide an element by adding the 'd-none' class
function hideElement(element) {
  if (typeof element === 'string') {
    element = document.getElementById(element);
  }
  if (element) {
    element.classList.add('d-none');
  }
}

// Show a success message for a specified duration
function showSuccessMessage(elementId, message, duration = 5000) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    showElement(element);
    
    if (duration > 0) {
      setTimeout(() => {
        hideElement(element);
      }, duration);
    }
  }
}

// Show an error message for a specified duration
function showErrorMessage(elementId, message, duration = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    showElement(element);
    
    if (duration > 0) {
      setTimeout(() => {
        hideElement(element);
      }, duration);
    }
  }
}

// Collect form data from a form element into an object
function getFormData(formElement) {
  const formData = {};
  const formElements = formElement.elements;
  
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    if (element.name && element.name !== '') {
      formData[element.name] = element.value;
    }
  }
  
  return formData;
}

// Reset a form to its initial state
function resetForm(formElement) {
  if (formElement) {
    formElement.reset();
  }
}

// Populate a form with data
function populateForm(formElement, data) {
  if (!formElement || !data) return;
  
  Object.keys(data).forEach(key => {
    const element = formElement.elements[key];
    if (element) {
      element.value = data[key] || '';
    }
  });
}

// Create HTML for a view modal from an Agniveer object
function createViewModalContent(agniveer) {
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
  const renderInfoSection = (title, fields) => {
    let html = `
      <div class="card mb-3">
        <div class="card-header">${title}</div>
        <div class="card-body">
          <div class="row">`;
    
    fields.forEach(field => {
      html += `
        <div class="col-md-6 mb-2">
          <div class="d-flex">
            <strong class="me-2" style="min-width: 160px">${field.label}:</strong>
            <span>${field.value || 'Not specified'}</span>
          </div>
        </div>`;
    });
    
    html += `
          </div>
        </div>
      </div>`;
    
    return html;
  };
  
  // Generate the complete HTML
  const html = `
    ${renderInfoSection('Personal Information', personalInfo)}
    ${renderInfoSection('Identification', identificationInfo)}
    ${renderInfoSection('Home Address', addressInfo)}
    ${renderInfoSection('Next of Kin (NOK) Details', nokInfo)}
    ${renderInfoSection('Miscellaneous', miscInfo)}
  `;
  
  return html;
}

// Format API error response for display
function formatApiError(response) {
  if (response && response.message) {
    return response.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

// Make an API request
async function apiRequest(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    return { success: false, message: 'Network error. Please check your connection and try again.' };
  }
}