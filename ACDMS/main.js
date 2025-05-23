const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeDatabase, getAllAgniveers, addAgniveer, updateAgniveer, deleteAgniveer, searchAgniveers } = require('./db/database');
const xlsx = require('xlsx');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'src/assets/military-logo.svg'),
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
  
  // Remove menu bar for production
  // mainWindow.removeMenu();
  
  // Open DevTools during development
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  initializeDatabase();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for database operations
ipcMain.handle('authenticate', async (event, credentials) => {
  const { username, password } = credentials;
  
  // Fixed credentials as per requirements
  if (username === 'admin' && password === 'ARCShillong') {
    return { success: true };
  }
  
  return { success: false, message: 'Invalid credentials. Please try again.' };
});

ipcMain.handle('get-all-agniveers', async () => {
  try {
    const agniveers = await getAllAgniveers();
    return { success: true, data: agniveers };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('add-agniveer', async (event, agniveerData) => {
  try {
    await addAgniveer(agniveerData);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('update-agniveer', async (event, agniveerData) => {
  try {
    await updateAgniveer(agniveerData);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('delete-agniveer', async (event, id) => {
  try {
    await deleteAgniveer(id);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('search-agniveers', async (event, filters) => {
  try {
    const results = await searchAgniveers(filters);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Export to Excel/CSV
ipcMain.handle('export-data', async (event, { format, data }) => {
  try {
    const options = {
      title: 'Save Agniveer Data',
      defaultPath: format === 'csv' ? 'agniveer_data.csv' : 'agniveer_data.xlsx',
      filters: [
        { name: format.toUpperCase(), extensions: [format] }
      ]
    };

    const { filePath } = await dialog.showSaveDialog(mainWindow, options);
    
    if (!filePath) return { success: false, message: 'Export cancelled' };
    
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Agniveers');
    
    xlsx.writeFile(workbook, filePath);
    
    return { success: true, message: 'Data exported successfully' };
  } catch (error) {
    return { success: false, message: `Export failed: ${error.message}` };
  }
});

// Import from Excel/CSV
ipcMain.handle('import-data', async () => {
  try {
    const options = {
      title: 'Import Agniveer Data',
      filters: [
        { name: 'Spreadsheets', extensions: ['xlsx', 'csv'] }
      ],
      properties: ['openFile']
    };

    const { filePaths } = await dialog.showOpenDialog(mainWindow, options);
    
    if (!filePaths || filePaths.length === 0) {
      return { success: false, message: 'Import cancelled' };
    }
    
    const filePath = filePaths[0];
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    // Process the imported data
    for (const record of data) {
      await addAgniveer(record);
    }
    
    return { 
      success: true, 
      message: `${data.length} records imported successfully`,
      data: data
    };
  } catch (error) {
    return { success: false, message: `Import failed: ${error.message}` };
  }
});
