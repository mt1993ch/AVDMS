# ACDMS - Step by Step Windows Installation

## Pre-Installation Checklist

✓ Windows 10 or 11
✓ Administrator access to your computer
✓ 1GB free disk space
✓ Internet connection (only needed for installation)

## Installation Steps with Screenshots

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   
2. Run the installer
   - Check "Automatically install necessary tools"
   - Follow the prompts to complete installation

### Step 2: Download and Extract ACDMS

1. Create a folder called "ACDMS" on your computer (e.g., C:\ACDMS)
2. Copy all the application files to this folder
3. Verify the folder structure includes these important files:
   - server.js
   - init-db.js
   - package.json
   - start_acdms.bat
   - db/ (folder)
   - public/ (folder)

### Step 3: Install Dependencies

1. Open Command Prompt as Administrator
   - Press Windows key
   - Type "cmd"
   - Right-click "Command Prompt" and select "Run as administrator"
   
2. Navigate to your ACDMS folder
   ```
   cd C:\ACDMS
   ```
   
3. Install required packages
   ```
   npm install
   ```
   
4. Wait for installation to complete (may take several minutes)

### Step 4: Initialize the Database

1. In the same Command Prompt window, run:
   ```
   node init-db.js
   ```
   
2. You should see a message: "Database initialization completed successfully!"

### Step 5: Create a Shortcut

1. Right-click on start_acdms.bat
2. Select "Create shortcut"
3. Move the shortcut to your desktop
4. (Optional) Rename it to "ACDMS"

### Step 6: Start Using ACDMS

1. Double-click the shortcut to start the application
2. A Command Prompt window will open - keep this open while using the application
3. Your web browser will open to http://localhost:5000
4. Log in with:
   - Username: admin
   - Password: ARCShillong

## Troubleshooting Guide

### Problem: "node" is not recognized

**Solution:**
- Restart your computer to apply Node.js installation
- Verify Node.js installation by running `node -v` in Command Prompt

### Problem: Dependencies fail to install

**Solution:**
- Make sure you have internet connection
- Try running Command Prompt as Administrator
- Run `npm cache clean --force` then try again

### Problem: Port 5000 already in use

**Solution:**
- Close other applications that might be using port 5000
- Edit server.js and change port from 5000 to another number (e.g., 5001)

### Problem: Import/Export not working

**Solution:**
- Make sure your Excel/CSV has column headers matching database fields
- Check for spaces or special characters in your file
- Try a smaller file for testing

## Important Notes

- Always start the application using the provided shortcut or batch file
- Keep the Command Prompt window open while using the application
- Regular backups are recommended using the Export feature
- The application works completely offline after installation