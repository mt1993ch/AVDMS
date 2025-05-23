import React, { useState, useEffect } from 'react';
import { useTheme } from '../styles/theme';
import ViewAgniveerModal from './ViewAgniveerModal';
import EditAgniveerModal from './EditAgniveerModal';
import ImportExport from './ImportExport';

function DataManagement({ navigateTo }) {
  const { colors } = useTheme();
  const [agniveers, setAgniveers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgniveer, setSelectedAgniveer] = useState(null);
  
  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [agniveerToDelete, setAgniveerToDelete] = useState(null);
  
  // Load all Agniveers on component mount
  useEffect(() => {
    loadAgniveers();
  }, []);
  
  // Load Agniveers from database
  const loadAgniveers = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await window.api.getAllAgniveers();
      
      if (result.success) {
        setAgniveers(result.data);
      } else {
        setError(result.message || 'Failed to load Agniveers. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while loading data. Please try again.');
      console.error('Data Management error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open view modal
  const handleViewAgniveer = (agniveer) => {
    setSelectedAgniveer(agniveer);
    setViewModalOpen(true);
  };
  
  // Open edit modal
  const handleEditAgniveer = (agniveer) => {
    setSelectedAgniveer(agniveer);
    setEditModalOpen(true);
  };
  
  // Show delete confirmation
  const confirmDeleteAgniveer = (agniveer) => {
    setAgniveerToDelete(agniveer);
    setShowConfirmation(true);
  };
  
  // Delete Agniveer
  const handleDeleteAgniveer = async () => {
    if (!agniveerToDelete) return;
    
    try {
      const result = await window.api.deleteAgniveer(agniveerToDelete.id);
      
      if (result.success) {
        setSuccess(`Successfully deleted ${agniveerToDelete.name}.`);
        loadAgniveers(); // Reload data
      } else {
        setError(result.message || 'Failed to delete Agniveer. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while deleting. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setShowConfirmation(false);
      setAgniveerToDelete(null);
    }
  };
  
  // Cancel delete confirmation
  const cancelDelete = () => {
    setShowConfirmation(false);
    setAgniveerToDelete(null);
  };
  
  // Handle successful edit
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSuccess('Agniveer information updated successfully.');
    loadAgniveers(); // Reload data
  };

  // Handle import success
  const handleImportSuccess = (count) => {
    setSuccess(`Successfully imported ${count} records.`);
    loadAgniveers(); // Reload data
  };
  
  // Handle export success
  const handleExportSuccess = () => {
    setSuccess('Data exported successfully.');
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
          <h2 className="section-title">Data Management</h2>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Import & Export</span>
        </div>
        <div className="card-body">
          <ImportExport 
            agniveers={agniveers} 
            onImportSuccess={handleImportSuccess}
            onExportSuccess={handleExportSuccess}
          />
        </div>
      </div>
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Agniveer Records</span>
          <span className="badge bg-primary">{agniveers.length} records</span>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : agniveers.length > 0 ? (
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agniveers.map(agniveer => (
                    <tr key={agniveer.id}>
                      <td>{agniveer.batch_no}</td>
                      <td>{agniveer.number}</td>
                      <td>{agniveer.rank}</td>
                      <td>{agniveer.name}</td>
                      <td>{agniveer.date_of_enrolment}</td>
                      <td>{agniveer.district}</td>
                      <td>{agniveer.state}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewAgniveer(agniveer)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEditAgniveer(agniveer)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDeleteAgniveer(agniveer)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No Agniveer records found. Add new records using the "Add a New Agniveer" option from the homepage.
            </div>
          )}
        </div>
      </div>
      
      {/* View Modal */}
      {viewModalOpen && selectedAgniveer && (
        <ViewAgniveerModal
          agniveer={selectedAgniveer}
          onClose={() => setViewModalOpen(false)}
        />
      )}
      
      {/* Edit Modal */}
      {editModalOpen && selectedAgniveer && (
        <EditAgniveerModal
          agniveer={selectedAgniveer}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSuccess}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {showConfirmation && agniveerToDelete && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the record of <strong>{agniveerToDelete.name}</strong>?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteAgniveer}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataManagement;
