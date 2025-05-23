import React, { useState } from 'react';
import { useTheme } from '../styles/theme';

function ImportExport({ agniveers, onImportSuccess, onExportSuccess }) {
  const { colors } = useTheme();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  
  // Handle import button click
  const handleImport = async () => {
    setImporting(true);
    setError('');
    
    try {
      const result = await window.api.importData();
      
      if (result.success) {
        onImportSuccess(result.data.length);
      } else {
        setError(result.message || 'Failed to import data. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during import. Please try again.');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };
  
  // Handle export button click for CSV
  const handleExportCSV = async () => {
    await handleExport('csv');
  };
  
  // Handle export button click for Excel
  const handleExportExcel = async () => {
    await handleExport('xlsx');
  };
  
  // Generic export handler
  const handleExport = async (format) => {
    if (agniveers.length === 0) {
      setError('No data to export. Please add records first.');
      return;
    }
    
    setExporting(true);
    setError('');
    
    try {
      const result = await window.api.exportData({
        format,
        data: agniveers
      });
      
      if (result.success) {
        onExportSuccess();
      } else {
        setError(result.message || `Failed to export to ${format.toUpperCase()}. Please try again.`);
      }
    } catch (err) {
      setError('An error occurred during export. Please try again.');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i 
                  data-feather="upload" 
                  style={{ verticalAlign: 'middle', marginRight: '8px', color: colors.primary }}
                ></i>
                Import Data
              </h5>
              <p className="card-text">
                Import Agniveer records from CSV or Excel files. The system will match column headers with the database fields.
              </p>
              <button
                className="btn btn-primary"
                onClick={handleImport}
                disabled={importing}
              >
                {importing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Importing...
                  </>
                ) : (
                  <>
                    <i 
                      data-feather="upload" 
                      style={{ verticalAlign: 'middle', marginRight: '5px' }}
                    ></i>
                    Import from File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i 
                  data-feather="download" 
                  style={{ verticalAlign: 'middle', marginRight: '8px', color: colors.primary }}
                ></i>
                Export Data
              </h5>
              <p className="card-text">
                Export all Agniveer records to CSV or Excel format for backup or reporting purposes.
              </p>
              <div className="btn-group">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleExportCSV}
                  disabled={exporting || agniveers.length === 0}
                >
                  <i 
                    data-feather="file-text" 
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  ></i>
                  Export as CSV
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleExportExcel}
                  disabled={exporting || agniveers.length === 0}
                >
                  <i 
                    data-feather="file" 
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  ></i>
                  Export as Excel
                </button>
              </div>
              {exporting && (
                <div className="mt-2">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span className="visually-hidden">Exporting...</span>
                  </div>
                  <small>Exporting data...</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="alert alert-info">
        <i 
          data-feather="info" 
          style={{ verticalAlign: 'middle', marginRight: '8px' }}
        ></i>
        <span>
          <strong>Note:</strong> For importing data, please ensure your spreadsheet has column headers that match the field names in the system.
        </span>
      </div>
    </div>
  );
}

export default ImportExport;
