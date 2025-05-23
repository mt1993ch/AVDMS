const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld('api', {
  // Authentication
  authenticate: (credentials) => ipcRenderer.invoke('authenticate', credentials),
  
  // Database operations
  getAllAgniveers: () => ipcRenderer.invoke('get-all-agniveers'),
  addAgniveer: (data) => ipcRenderer.invoke('add-agniveer', data),
  updateAgniveer: (data) => ipcRenderer.invoke('update-agniveer', data),
  deleteAgniveer: (id) => ipcRenderer.invoke('delete-agniveer', id),
  searchAgniveers: (filters) => ipcRenderer.invoke('search-agniveers', filters),
  
  // Import/Export operations
  exportData: (options) => ipcRenderer.invoke('export-data', options),
  importData: () => ipcRenderer.invoke('import-data')
});
