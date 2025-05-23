// Management page search functionality
function handleManageSearch() {
  const nameInput = document.getElementById('manage-search-name');
  const batchInput = document.getElementById('manage-search-batch');
  const rankInput = document.getElementById('manage-search-rank');
  
  const filters = {
    name: nameInput ? nameInput.value : '',
    batch_no: batchInput ? batchInput.value : '',
    rank: rankInput ? rankInput.value : ''
  };
  
  // Filter the records based on inputs
  let filteredRecords = [...window.appState.agniveers];
  
  if (filters.name) {
    filteredRecords = filteredRecords.filter(record => 
      record.name && record.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }
  
  if (filters.batch_no) {
    filteredRecords = filteredRecords.filter(record => 
      record.batch_no && record.batch_no.toLowerCase().includes(filters.batch_no.toLowerCase())
    );
  }
  
  if (filters.rank) {
    filteredRecords = filteredRecords.filter(record => 
      record.rank && record.rank.toLowerCase().includes(filters.rank.toLowerCase())
    );
  }
  
  // Display the filtered records
  window.displayManagementTable(filteredRecords);
  
  // Update the count
  document.getElementById('manage-count').textContent = `${filteredRecords.length} records`;
}

// Make this function available globally
window.handleManageSearch = handleManageSearch;