/**
 * Main JavaScript for ACDMS Web Application
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons
  feather.replace();
  
  // Application state - making it global for other scripts to access
  window.appState = {
    isAuthenticated: false,
    currentPage: 'home',
    isDarkMode: false,
    selectedAgniveer: null,
    agniveers: []
  };
  
  // Use appState as an alias for window.appState for easier access in this file
  const appState = window.appState;
  
  // DOM elements
  const elements = {
    // Sections
    loginSection: document.getElementById('login-section'),
    appSection: document.getElementById('app-section'),
    
    // Pages
    homePage: document.getElementById('home-page'),
    searchPage: document.getElementById('search-page'),
    addPage: document.getElementById('add-page'),
    managePage: document.getElementById('manage-page'),
    
    // Forms
    loginForm: document.getElementById('login-form'),
    searchForm: document.getElementById('search-form'),
    addForm: document.getElementById('add-agniveer-form'),
    
    // Buttons
    logoutButton: document.getElementById('logout-button'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    
    // Chatbot
    chatbotToggle: document.getElementById('chatbot-toggle'),
    chatbotContainer: document.getElementById('chatbot-container'),
    chatbotMessages: document.getElementById('chatbot-messages'),
    chatbotForm: document.getElementById('chatbot-form'),
    chatbotInput: document.getElementById('chatbot-input'),
    
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    homeCards: document.querySelectorAll('.home-card'),
    
    // Modals
    viewModal: new bootstrap.Modal(document.getElementById('view-modal')),
    editModal: new bootstrap.Modal(document.getElementById('edit-modal')),
    deleteModal: new bootstrap.Modal(document.getElementById('delete-modal'))
  };
  
  // Initialize application
  initializeApplication();
  
  // Application initialization
  function initializeApplication() {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      toggleDarkMode();
    }
    
    // Check if user is already authenticated
    const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (savedAuth) {
      authenticateUser();
    }
    
    // Event listeners
    attachEventListeners();
  }
  
  // Attach event listeners
  function attachEventListeners() {
    // Login form
    elements.loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    elements.logoutButton.addEventListener('click', handleLogout);
    
    // Dark mode toggle
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Navigation links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateTo(page);
      });
    });
    
    // Home cards
    elements.homeCards.forEach(card => {
      card.addEventListener('click', () => {
        const page = card.getAttribute('data-navigate');
        navigateTo(page);
      });
    });
    
    // Chatbot toggle
    elements.chatbotToggle.addEventListener('click', toggleChatbot);
    document.getElementById('chatbot-close').addEventListener('click', toggleChatbot);
    
    // Chatbot form
    elements.chatbotForm.addEventListener('submit', handleChatbotSubmit);
    
    // Search form
    elements.searchForm.addEventListener('submit', handleSearch);
    
    // Advanced filters toggle
    document.getElementById('toggle-advanced-filters').addEventListener('click', toggleAdvancedFilters);
    
    // Reset search
    document.getElementById('reset-search').addEventListener('click', resetSearch);
    
    // Add Agniveer form
    elements.addForm.addEventListener('submit', handleAddAgniveer);
    
    // Same address checkbox in add form
    document.getElementById('same_address').addEventListener('change', handleSameAddressChange);
    
    // Import/Export buttons
    document.getElementById('import-button').addEventListener('click', handleImportClick);
    document.getElementById('import-file').addEventListener('change', handleFileImport);
    document.getElementById('export-csv').addEventListener('click', () => handleExport('csv'));
    document.getElementById('export-excel').addEventListener('click', () => handleExport('xlsx'));
    
    // Delete confirmation
    document.getElementById('confirm-delete').addEventListener('click', confirmDeleteAgniveer);
    
    // Management page search
    const manageSearchButton = document.getElementById('manage-search-button');
    if (manageSearchButton) {
      manageSearchButton.addEventListener('click', handleManageSearch);
    }
    
    // Make sure the navbar logo has event listener
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
      navbarBrand.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
      });
    }
  }
  
  // Authentication functions
  async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Disable login button
    const loginButton = document.getElementById('login-button');
    loginButton.disabled = true;
    loginButton.textContent = 'Authenticating...';
    
    try {
      // Call authentication API
      const response = await apiRequest('/api/authenticate', 'POST', { username, password });
      
      if (response.success) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        authenticateUser();
      } else {
        // Show error message
        showErrorMessage('login-error', response.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      showErrorMessage('login-error', 'Authentication failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      // Re-enable login button
      loginButton.disabled = false;
      loginButton.textContent = 'Login';
    }
  }
  
  function authenticateUser() {
    appState.isAuthenticated = true;
    
    // Hide login, show app
    hideElement(elements.loginSection);
    showElement(elements.appSection);
    
    // Load the home page
    navigateTo('home');
    
    // Load Agniveers data for the management page
    loadAgniveers();
  }
  
  function handleLogout() {
    appState.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    
    // Hide app, show login
    hideElement(elements.appSection);
    showElement(elements.loginSection);
    
    // Reset form
    resetForm(elements.loginForm);
    hideElement('login-error');
  }
  
  // Navigation functions
  function navigateTo(page) {
    // Hide all pages
    hideElement(elements.homePage);
    hideElement(elements.searchPage);
    hideElement(elements.addPage);
    hideElement(elements.managePage);
    
    // Update active nav link
    elements.navLinks.forEach(link => {
      if (link.getAttribute('data-page') === page) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Show selected page
    appState.currentPage = page;
    switch (page) {
      case 'home':
        showElement(elements.homePage);
        break;
      case 'search':
        showElement(elements.searchPage);
        break;
      case 'add':
        showElement(elements.addPage);
        break;
      case 'manage':
        showElement(elements.managePage);
        loadAgniveers(); // Refresh data when navigating to manage page
        break;
    }
    
    // Update chatbot context
    updateChatbotContext();
  }
  
  // Dark mode functions
  function toggleDarkMode() {
    appState.isDarkMode = !appState.isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    // Update dark mode toggle icon
    const icon = elements.darkModeToggle.querySelector('i');
    if (icon) {
      if (appState.isDarkMode) {
        icon.setAttribute('data-feather', 'sun');
      } else {
        icon.setAttribute('data-feather', 'moon');
      }
      feather.replace();
    }
    
    // Save preference to local storage
    localStorage.setItem('darkMode', appState.isDarkMode.toString());
  }
  
  // Chatbot functions
  function toggleChatbot() {
    const isOpen = !elements.chatbotContainer.classList.contains('d-none');
    
    if (isOpen) {
      hideElement(elements.chatbotContainer);
      showElement(elements.chatbotToggle);
    } else {
      showElement(elements.chatbotContainer);
      hideElement(elements.chatbotToggle);
      updateChatbotContext();
    }
  }
  
  function updateChatbotContext() {
    // Don't add any automatic messages - user reported seeing too many welcome messages
    // We'll let the initial welcome message in the HTML handle this
  }
  
  async function handleChatbotSubmit(e) {
    e.preventDefault();
    
    const message = elements.chatbotInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatbotMessage(message, 'user');
    elements.chatbotInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message message-bot typing';
    typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    elements.chatbotMessages.appendChild(typingIndicator);
    scrollChatToBottom();
    
    // Generate response after a delay
    await simulateTypingDelay();
    
    // Remove typing indicator
    elements.chatbotMessages.removeChild(typingIndicator);
    
    // Add bot response
    const response = generateChatbotResponse(message);
    addChatbotMessage(response, 'bot');
  }
  
  function addChatbotMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${sender}`;
    messageDiv.textContent = text;
    
    elements.chatbotMessages.appendChild(messageDiv);
    scrollChatToBottom();
  }
  
  function scrollChatToBottom() {
    elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight;
  }
  
  // Search functions
  function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    const isVisible = !advancedFilters.classList.contains('d-none');
    const toggleButton = document.getElementById('toggle-advanced-filters');
    
    if (isVisible) {
      hideElement(advancedFilters);
      toggleButton.textContent = 'Show Advanced Filters';
    } else {
      showElement(advancedFilters);
      toggleButton.textContent = 'Hide Advanced Filters';
    }
  }
  
  function resetSearch() {
    resetForm(elements.searchForm);
    
    // Hide advanced filters
    hideElement('advanced-filters');
    document.getElementById('toggle-advanced-filters').textContent = 'Show Advanced Filters';
    
    // Reset search results
    hideElement('search-results-container');
    showElement('search-message');
    document.getElementById('search-count').textContent = '0 records found';
  }
  
  async function handleSearch(e) {
    e.preventDefault();
    
    // Get form data
    const filters = getFormData(elements.searchForm);
    
    // Disable search button
    const searchButton = document.getElementById('search-button');
    searchButton.disabled = true;
    searchButton.textContent = 'Searching...';
    
    try {
      // Call search API
      const response = await apiRequest('/api/agniveers/search', 'POST', filters);
      
      if (response.success) {
        // Update search results
        displaySearchResults(response.data);
      } else {
        showErrorMessage('search-message', formatApiError(response));
      }
    } catch (error) {
      showErrorMessage('search-message', 'An error occurred during the search. Please try again.');
      console.error('Search error:', error);
    } finally {
      // Re-enable search button
      searchButton.disabled = false;
      searchButton.textContent = 'Search';
    }
  }
  
  function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results-container');
    const resultsTable = document.getElementById('search-results');
    const resultsBody = resultsTable.querySelector('tbody');
    const messageElement = document.getElementById('search-message');
    
    // Update count
    document.getElementById('search-count').textContent = `${results.length} records found`;
    
    if (results.length === 0) {
      // Show message for no results
      messageElement.textContent = 'No matching records found.';
      showElement(messageElement);
      hideElement(resultsContainer);
      return;
    }
    
    // Clear previous results
    resultsBody.innerHTML = '';
    
    // Add new results
    results.forEach(agniveer => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${agniveer.batch_no || ''}</td>
        <td>${agniveer.number || ''}</td>
        <td>${agniveer.rank || ''}</td>
        <td>${agniveer.name || ''}</td>
        <td>${agniveer.date_of_enrolment ? formatDate(agniveer.date_of_enrolment) : ''}</td>
        <td>${agniveer.district || ''}</td>
        <td>${agniveer.state || ''}</td>
        <td>${agniveer.medical_category || ''}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-agniveer" data-id="${agniveer.id}">
            View
          </button>
        </td>
      `;
      
      resultsBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    resultsBody.querySelectorAll('.view-agniveer').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-id'));
        const agniveer = results.find(a => a.id === id);
        
        if (agniveer) {
          viewAgniveer(agniveer);
        }
      });
    });
    
    // Show results table, hide message
    hideElement(messageElement);
    showElement(resultsContainer);
  }
  
  // Add Agniveer functions
  function handleSameAddressChange(e) {
    const checked = e.target.checked;
    
    if (checked) {
      // Copy home address to NOK address
      document.getElementById('nok_village').value = document.getElementById('village').value;
      document.getElementById('nok_tehsil').value = document.getElementById('tehsil').value;
      document.getElementById('nok_post_office').value = document.getElementById('post_office').value;
      document.getElementById('nok_police_station').value = document.getElementById('police_station').value;
      document.getElementById('nok_district').value = document.getElementById('district').value;
      document.getElementById('nok_state').value = document.getElementById('state').value;
    }
  }
  
  async function handleAddAgniveer(e) {
    e.preventDefault();
    
    // Get form data
    const formData = getFormData(elements.addForm);
    
    // Validate form data
    const errors = validateAgniveerData(formData);
    
    if (Object.keys(errors).length > 0) {
      // Display validation errors
      displayValidationErrors(errors);
      window.scrollTo(0, 0);
      return;
    }
    
    // Hide previous messages
    hideElement('add-success');
    hideElement('add-error');
    hideElement('validation-errors');
    
    // Disable submit button
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
      // Call API to add Agniveer
      const response = await apiRequest('/api/agniveers', 'POST', formData);
      
      if (response.success) {
        // Show success message
        showElement('add-success');
        
        // Reset form
        resetForm(elements.addForm);
        
        // Scroll to top
        window.scrollTo(0, 0);
      } else {
        showErrorMessage('add-error', formatApiError(response));
      }
    } catch (error) {
      showErrorMessage('add-error', 'An error occurred while saving data. Please try again.');
      console.error('Add Agniveer error:', error);
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
  }
  
  function displayValidationErrors(errors) {
    const errorList = document.getElementById('error-list');
    errorList.innerHTML = '';
    
    Object.values(errors).forEach(message => {
      const li = document.createElement('li');
      li.textContent = message;
      errorList.appendChild(li);
    });
    
    showElement('validation-errors');
  }
  
  // Data Management functions
  async function loadAgniveers() {
    // Only load if on the manage page
    if (appState.currentPage !== 'manage') return;
    
    // Show loading indicator
    showElement('loading-indicator');
    hideElement('manage-empty');
    hideElement('manage-table-container');
    
    try {
      // Call API to get all Agniveers
      const response = await apiRequest('/api/agniveers');
      
      if (response.success) {
        appState.agniveers = response.data;
        
        // Update count
        document.getElementById('manage-count').textContent = `${appState.agniveers.length} records`;
        
        if (appState.agniveers.length === 0) {
          // Show empty message
          showElement('manage-empty');
        } else {
          // Display data in table
          displayManagementTable(appState.agniveers);
        }
      } else {
        showErrorMessage('manage-error', formatApiError(response));
      }
    } catch (error) {
      showErrorMessage('manage-error', 'An error occurred while loading data. Please try again.');
      console.error('Data Management error:', error);
    } finally {
      // Hide loading indicator
      hideElement('loading-indicator');
    }
  }
  
  // Make the function available globally so the search functionality can use it
  window.displayManagementTable = function displayManagementTable(agniveers) {
    const tableContainer = document.getElementById('manage-table-container');
    const table = document.getElementById('manage-table');
    const tableBody = table.querySelector('tbody');
    
    // Clear previous data
    tableBody.innerHTML = '';
    
    // Add new data
    agniveers.forEach(agniveer => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${agniveer.batch_no || ''}</td>
        <td>${agniveer.number || ''}</td>
        <td>${agniveer.rank || ''}</td>
        <td>${agniveer.name || ''}</td>
        <td>${agniveer.date_of_enrolment ? formatDate(agniveer.date_of_enrolment) : ''}</td>
        <td>${agniveer.district || ''}</td>
        <td>${agniveer.state || ''}</td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-primary view-btn" data-id="${agniveer.id}">
              View
            </button>
            <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${agniveer.id}">
              Edit
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${agniveer.id}">
              Delete
            </button>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    tableBody.querySelectorAll('.view-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-id'));
        const agniveer = agniveers.find(a => a.id === id);
        
        if (agniveer) {
          viewAgniveer(agniveer);
        }
      });
    });
    
    tableBody.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-id'));
        const agniveer = agniveers.find(a => a.id === id);
        
        if (agniveer) {
          editAgniveer(agniveer);
        }
      });
    });
    
    tableBody.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-id'));
        const agniveer = agniveers.find(a => a.id === id);
        
        if (agniveer) {
          deleteAgniveer(agniveer);
        }
      });
    });
    
    // Show table
    showElement(tableContainer);
  }
  
  function viewAgniveer(agniveer) {
    // Update modal title
    document.querySelector('#view-modal .modal-title').textContent = `Agniveer Details - ${agniveer.name}`;
    
    // Create and set content
    const viewContent = document.getElementById('view-content');
    viewContent.innerHTML = createViewModalContent(agniveer);
    
    // Show modal
    elements.viewModal.show();
  }
  
  function editAgniveer(agniveer) {
    // Set selected Agniveer
    appState.selectedAgniveer = agniveer;
    
    // Update modal title
    document.querySelector('#edit-modal .modal-title').textContent = `Edit Agniveer - ${agniveer.name}`;
    
    // Create edit form
    createEditForm(agniveer);
    
    // Show modal
    elements.editModal.show();
  }
  
  function createEditForm(agniveer) {
    const container = document.getElementById('edit-form-container');
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create form element
    const form = document.createElement('form');
    form.id = 'edit-agniveer-form';
    
    // Add form sections (complete version showing all fields)
    form.innerHTML = `
      <div class="alert alert-danger d-none" id="edit-error"></div>
      
      <!-- Personal Information -->
      <div class="card mb-3">
        <div class="card-header">Personal Information</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="edit_batch_no" class="form-label">Batch No.</label>
              <input type="text" class="form-control" id="edit_batch_no" name="batch_no" value="${agniveer.batch_no || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_number" class="form-label">No.</label>
              <input type="text" class="form-control" id="edit_number" name="number" value="${agniveer.number || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_rank" class="form-label">Rank</label>
              <input type="text" class="form-control" id="edit_rank" name="rank" value="${agniveer.rank || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_name" class="form-label">Name</label>
              <input type="text" class="form-control" id="edit_name" name="name" value="${agniveer.name || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_civil_education" class="form-label">Civil Education</label>
              <input type="text" class="form-control" id="edit_civil_education" name="civil_education" value="${agniveer.civil_education || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_date_of_birth" class="form-label">Date of Birth</label>
              <input type="date" class="form-control" id="edit_date_of_birth" name="date_of_birth" value="${agniveer.date_of_birth || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_date_of_enrolment" class="form-label">Date of Enrolment (DOE)</label>
              <input type="date" class="form-control" id="edit_date_of_enrolment" name="date_of_enrolment" value="${agniveer.date_of_enrolment || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_medical_category" class="form-label">Medical Category</label>
              <input type="text" class="form-control" id="edit_medical_category" name="medical_category" value="${agniveer.medical_category || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_date_of_training_commenced" class="form-label">Date of Training Commenced</label>
              <input type="date" class="form-control" id="edit_date_of_training_commenced" name="date_of_training_commenced" value="${agniveer.date_of_training_commenced || ''}">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Identification -->
      <div class="card mb-3">
        <div class="card-header">Identification</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="edit_account_number" class="form-label">Account Number</label>
              <input type="text" class="form-control" id="edit_account_number" name="account_number" value="${agniveer.account_number || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_pan_card_number" class="form-label">PAN Card Number</label>
              <input type="text" class="form-control" id="edit_pan_card_number" name="pan_card_number" value="${agniveer.pan_card_number || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_aadhar_card_number" class="form-label">Aadhar Card Number</label>
              <input type="text" class="form-control" id="edit_aadhar_card_number" name="aadhar_card_number" value="${agniveer.aadhar_card_number || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_identification_mark_1" class="form-label">Identification Mark (a)</label>
              <input type="text" class="form-control" id="edit_identification_mark_1" name="identification_mark_1" value="${agniveer.identification_mark_1 || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_identification_mark_2" class="form-label">Identification Mark (b)</label>
              <input type="text" class="form-control" id="edit_identification_mark_2" name="identification_mark_2" value="${agniveer.identification_mark_2 || ''}">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Home Address -->
      <div class="card mb-3">
        <div class="card-header">Home Address</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="edit_village" class="form-label">Village (Vill.)</label>
              <input type="text" class="form-control" id="edit_village" name="village" value="${agniveer.village || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_street" class="form-label">Street</label>
              <input type="text" class="form-control" id="edit_street" name="street" value="${agniveer.street || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_tehsil" class="form-label">Tehsil or Taluka Office (T.O.)</label>
              <input type="text" class="form-control" id="edit_tehsil" name="tehsil" value="${agniveer.tehsil || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_post_office" class="form-label">Post Office (P.O.)</label>
              <input type="text" class="form-control" id="edit_post_office" name="post_office" value="${agniveer.post_office || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_police_station" class="form-label">Police Station (P.S.)</label>
              <input type="text" class="form-control" id="edit_police_station" name="police_station" value="${agniveer.police_station || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_district" class="form-label">District (Dist.)</label>
              <input type="text" class="form-control" id="edit_district" name="district" value="${agniveer.district || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_state" class="form-label">State</label>
              <input type="text" class="form-control" id="edit_state" name="state" value="${agniveer.state || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_pin_code" class="form-label">PIN Code</label>
              <input type="text" class="form-control" id="edit_pin_code" name="pin_code" value="${agniveer.pin_code || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_nearest_railway_station" class="form-label">Nearest Railway Station (NRS)</label>
              <input type="text" class="form-control" id="edit_nearest_railway_station" name="nearest_railway_station" value="${agniveer.nearest_railway_station || ''}">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Next of Kin (NOK) Details -->
      <div class="card mb-3">
        <div class="card-header">Next of Kin (NOK) Details</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="edit_nok_name" class="form-label">Name of NOK</label>
              <input type="text" class="form-control" id="edit_nok_name" name="nok_name" value="${agniveer.nok_name || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_relationship" class="form-label">Relationship</label>
              <input type="text" class="form-control" id="edit_nok_relationship" name="nok_relationship" value="${agniveer.nok_relationship || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_village" class="form-label">Village (Vill.)</label>
              <input type="text" class="form-control" id="edit_nok_village" name="nok_village" value="${agniveer.nok_village || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_tehsil" class="form-label">Tehsil or Taluka Office (T.O.)</label>
              <input type="text" class="form-control" id="edit_nok_tehsil" name="nok_tehsil" value="${agniveer.nok_tehsil || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_post_office" class="form-label">Post Office (P.O.)</label>
              <input type="text" class="form-control" id="edit_nok_post_office" name="nok_post_office" value="${agniveer.nok_post_office || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_police_station" class="form-label">Police Station (P.S.)</label>
              <input type="text" class="form-control" id="edit_nok_police_station" name="nok_police_station" value="${agniveer.nok_police_station || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_district" class="form-label">District</label>
              <input type="text" class="form-control" id="edit_nok_district" name="nok_district" value="${agniveer.nok_district || ''}">
            </div>
            <div class="col-md-6">
              <label for="edit_nok_state" class="form-label">State</label>
              <input type="text" class="form-control" id="edit_nok_state" name="nok_state" value="${agniveer.nok_state || ''}">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Miscellaneous -->
      <div class="card mb-3">
        <div class="card-header">Miscellaneous</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="edit_sports_played" class="form-label">Sports Played & Level</label>
              <input type="text" class="form-control" id="edit_sports_played" name="sports_played" value="${agniveer.sports_played || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_hobbies" class="form-label">Hobbies & Level</label>
              <input type="text" class="form-control" id="edit_hobbies" name="hobbies" value="${agniveer.hobbies || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_ncc" class="form-label">NCC (If Yes, Level)</label>
              <input type="text" class="form-control" id="edit_ncc" name="ncc" value="${agniveer.ncc || ''}">
            </div>
            <div class="col-md-4">
              <label for="edit_police_verification_status" class="form-label">Police Verification Status</label>
              <select class="form-select" id="edit_police_verification_status" name="police_verification_status">
                <option value="Completed" ${agniveer.police_verification_status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Not Completed" ${agniveer.police_verification_status === 'Not Completed' ? 'selected' : ''}>Not Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-end mt-3">
        <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="save-edit-button">Save Changes</button>
      </div>
    `;
    
    // Add form to container
    container.appendChild(form);
    
    // Add submit event listener to the form
    form.addEventListener('submit', (e) => handleEditSubmit(e, agniveer.id));
  }
  
  async function handleEditSubmit(e, id) {
    e.preventDefault();
    
    // Get form data
    const form = document.getElementById('edit-agniveer-form');
    const formData = getFormData(form);
    formData.id = id; // Add ID to the form data
    
    // Disable save button
    const saveButton = document.getElementById('save-edit-button');
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';
    
    try {
      // Call API to update Agniveer
      const response = await apiRequest(`/api/agniveers/${id}`, 'PUT', formData);
      
      if (response.success) {
        // Hide modal
        elements.editModal.hide();
        
        // Show success message
        showSuccessMessage('manage-success', 'Agniveer information updated successfully.', 5000);
        
        // Reload Agniveers
        loadAgniveers();
      } else {
        showErrorMessage('edit-error', formatApiError(response));
      }
    } catch (error) {
      showErrorMessage('edit-error', 'An error occurred while saving data. Please try again.');
      console.error('Edit Agniveer error:', error);
    } finally {
      // Re-enable save button
      saveButton.disabled = false;
      saveButton.textContent = 'Save Changes';
    }
  }
  
  function deleteAgniveer(agniveer) {
    // Set selected Agniveer
    appState.selectedAgniveer = agniveer;
    
    // Update confirmation message
    document.querySelector('#delete-modal .modal-body p').textContent = 
      `Are you sure you want to delete the record of ${agniveer.name}?`;
    
    // Show modal
    elements.deleteModal.show();
  }
  
  async function confirmDeleteAgniveer() {
    // Check if an Agniveer is selected
    if (!appState.selectedAgniveer) {
      elements.deleteModal.hide();
      return;
    }
    
    try {
      // Call API to delete Agniveer
      const response = await apiRequest(`/api/agniveers/${appState.selectedAgniveer.id}`, 'DELETE');
      
      if (response.success) {
        // Show success message
        showSuccessMessage('manage-success', 
          `Successfully deleted ${appState.selectedAgniveer.name}.`, 5000);
        
        // Reload Agniveers
        loadAgniveers();
      } else {
        showErrorMessage('manage-error', formatApiError(response));
      }
    } catch (error) {
      showErrorMessage('manage-error', 'An error occurred while deleting. Please try again.');
      console.error('Delete error:', error);
    } finally {
      // Hide modal
      elements.deleteModal.hide();
      appState.selectedAgniveer = null;
    }
  }
  
  // Import/Export functions
  function handleImportClick() {
    document.getElementById('import-file').click();
  }
  
  async function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show loading message
    showElement(document.getElementById('manage-success'));
    document.getElementById('manage-success').textContent = 'Importing data, please wait...';
    hideElement(document.getElementById('manage-error'));
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Make API request to import data
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        showSuccessMessage('manage-success', result.message, 5000);
        
        // Reload agniveers list
        await loadAgniveers();
      } else {
        showErrorMessage('manage-error', result.message || 'Import failed. Please try again.');
      }
    } catch (error) {
      showErrorMessage('manage-error', 'An error occurred during import. Please try again.');
      console.error('Import error:', error);
    } finally {
      // Reset file input
      e.target.value = '';
    }
  }
  
  function handleExport(format) {
    if (appState.agniveers.length === 0) {
      showErrorMessage('manage-error', 'No data to export. Please add records first.');
      return;
    }
    
    // Show loading message
    showElement(document.getElementById('manage-success'));
    document.getElementById('manage-success').textContent = 'Preparing export, please wait...';
    hideElement(document.getElementById('manage-error'));
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = `/api/export/${format}`;
    link.download = `agniveers.${format}`;
    
    // Add the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    setTimeout(() => {
      showSuccessMessage('manage-success', `Data exported successfully as ${format.toUpperCase()}.`, 5000);
    }, 1000);
  }
});