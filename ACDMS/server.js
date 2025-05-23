const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const { initializeDatabase, getAllAgniveers, addAgniveer, updateAgniveer, deleteAgniveer, searchAgniveers } = require('./db/database');

const app = express();
const port = 5000;

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the src directory
app.use(express.static('public'));

// Initialize database on startup
initializeDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Route for the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Authentication endpoint
app.post('/api/authenticate', (req, res) => {
  const { username, password } = req.body;
  
  // Fixed credentials as per requirements
  if (username === 'admin' && password === 'ARCShillong') {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials. Please try again.' });
  }
});

// Get all Agniveers
app.get('/api/agniveers', async (req, res) => {
  try {
    const agniveers = await getAllAgniveers();
    res.json({ success: true, data: agniveers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Add new Agniveer
app.post('/api/agniveers', async (req, res) => {
  try {
    const agniveerData = req.body;
    await addAgniveer(agniveerData);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Update Agniveer
app.put('/api/agniveers/:id', async (req, res) => {
  try {
    const agniveerData = req.body;
    agniveerData.id = parseInt(req.params.id);
    await updateAgniveer(agniveerData);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Delete Agniveer
app.delete('/api/agniveers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteAgniveer(id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Search Agniveers
app.post('/api/agniveers/search', async (req, res) => {
  try {
    const filters = req.body;
    const results = await searchAgniveers(filters);
    res.json({ success: true, data: results });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Import from file
app.post('/api/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    // Parse the file based on extension
    let workbook;
    try {
      workbook = xlsx.readFile(filePath);
    } catch (error) {
      return res.json({ success: false, message: 'Could not read file. Please ensure it is a valid Excel or CSV file.' });
    }
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(sheet);
    
    if (data.length === 0) {
      return res.json({ success: false, message: 'No data found in the file' });
    }
    
    // Insert each record into the database
    let successCount = 0;
    for (const record of data) {
      try {
        await addAgniveer(record);
        successCount++;
      } catch (error) {
        console.error('Error importing record:', error);
        // Continue with next record
      }
    }
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: `Imported ${successCount} out of ${data.length} records successfully.` 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Export data
app.get('/api/export/:format', async (req, res) => {
  try {
    const format = req.params.format.toLowerCase();
    if (format !== 'xlsx' && format !== 'csv') {
      return res.json({ success: false, message: 'Unsupported format. Use xlsx or csv.' });
    }
    
    // Get all agniveers
    const agniveers = await getAllAgniveers();
    
    if (agniveers.length === 0) {
      return res.json({ success: false, message: 'No data to export' });
    }
    
    // Create a new workbook
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(agniveers);
    xlsx.utils.book_append_sheet(wb, ws, 'Agniveers');
    
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `agniveers_${timestamp}.${format}`;
    const filePath = path.join(tempDir, fileName);
    
    // Write file
    xlsx.writeFile(wb, filePath);
    
    // Send file to client
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      
      // Delete file after sending
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`ACDMS server running at http://0.0.0.0:${port}`);
});