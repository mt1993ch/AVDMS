import React, { useState, useEffect } from 'react';
import { useTheme } from '../styles/theme';

function SearchDatabase({ navigateTo }) {
  const { colors } = useTheme();
  const [searchFilters, setSearchFilters] = useState({
    batch_no: '',
    name: '',
    rank: '',
    district: '',
    medical_category: '',
    date_of_enrolment: '',
    state: ''
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Handle input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle search form submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setMessage('');
    
    // Check if at least one filter has a value
    const hasFilters = Object.values(searchFilters).some(value => value.trim() !== '');
    
    if (!hasFilters) {
      // If no filters, fetch all records
      try {
        const result = await window.api.getAllAgniveers();
        
        if (result.success) {
          setSearchResults(result.data);
          if (result.data.length === 0) {
            setMessage('No records found in the database.');
          }
        } else {
          setMessage(result.message || 'Failed to fetch records. Please try again.');
        }
      } catch (err) {
        setMessage('An error occurred during the search. Please try again.');
        console.error('Search error:', err);
      }
    } else {
      // If filters are set, search with filters
      try {
        const result = await window.api.searchAgniveers(searchFilters);
        
        if (result.success) {
          setSearchResults(result.data);
          if (result.data.length === 0) {
            setMessage('No matching records found.');
          }
        } else {
          setMessage(result.message || 'Failed to search records. Please try again.');
        }
      } catch (err) {
        setMessage('An error occurred during the search. Please try again.');
        console.error('Search error:', err);
      }
    }
    
    setIsSearching(false);
  };
  
  // Reset search filters
  const handleReset = () => {
    setSearchFilters({
      batch_no: '',
      name: '',
      rank: '',
      district: '',
      medical_category: '',
      date_of_enrolment: '',
      state: ''
    });
  };
  
  // Toggle advanced filters visibility
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };
  
  // Load all records on initial component mount
  useEffect(() => {
    handleSearch();
  }, []);
  
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
          <h2 className="section-title">Search Database</h2>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          Search Filters
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={searchFilters.name}
                  onChange={handleFilterChange}
                  placeholder="Enter name"
                />
              </div>
              
              <div className="col-md-4">
                <label htmlFor="batch_no" className="form-label">Batch No.</label>
                <input
                  type="text"
                  className="form-control"
                  id="batch_no"
                  name="batch_no"
                  value={searchFilters.batch_no}
                  onChange={handleFilterChange}
                  placeholder="Enter batch number"
                />
              </div>
              
              <div className="col-md-4">
                <label htmlFor="rank" className="form-label">Rank</label>
                <input
                  type="text"
                  className="form-control"
                  id="rank"
                  name="rank"
                  value={searchFilters.rank}
                  onChange={handleFilterChange}
                  placeholder="Enter rank"
                />
              </div>
              
              {showAdvancedFilters && (
                <>
                  <div className="col-md-4">
                    <label htmlFor="district" className="form-label">District</label>
                    <input
                      type="text"
                      className="form-control"
                      id="district"
                      name="district"
                      value={searchFilters.district}
                      onChange={handleFilterChange}
                      placeholder="Enter district"
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={searchFilters.state}
                      onChange={handleFilterChange}
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label htmlFor="medical_category" className="form-label">Medical Category</label>
                    <input
                      type="text"
                      className="form-control"
                      id="medical_category"
                      name="medical_category"
                      value={searchFilters.medical_category}
                      onChange={handleFilterChange}
                      placeholder="Enter medical category"
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label htmlFor="date_of_enrolment" className="form-label">Date of Enrolment</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date_of_enrolment"
                      name="date_of_enrolment"
                      value={searchFilters.date_of_enrolment}
                      onChange={handleFilterChange}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="row mt-3">
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={toggleAdvancedFilters}
                >
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                </button>
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Search Results</span>
          <span className="badge bg-primary">{searchResults.length} records found</span>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('error') ? 'alert-danger' : 'alert-info'}`}>
              {message}
            </div>
          )}
          
          {searchResults.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Batch No.</th>
                    <th>No.</th>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Date of Enrolment</th>
                    <th>District</th>
                    <th>State</th>
                    <th>Medical Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map(agniveer => (
                    <tr key={agniveer.id}>
                      <td>{agniveer.batch_no}</td>
                      <td>{agniveer.number}</td>
                      <td>{agniveer.rank}</td>
                      <td>{agniveer.name}</td>
                      <td>{agniveer.date_of_enrolment}</td>
                      <td>{agniveer.district}</td>
                      <td>{agniveer.state}</td>
                      <td>{agniveer.medical_category}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => navigateTo('manage', { viewId: agniveer.id })}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !message && <p className="text-center">No records to display. Use the search filters above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchDatabase;
