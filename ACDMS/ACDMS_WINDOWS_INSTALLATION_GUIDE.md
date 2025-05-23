# ACDMS Windows Installation Guide

This guide provides step-by-step instructions for downloading, installing, and using the Agniveer Centralised Data Management System (ACDMS) on your Windows PC.

## System Requirements

- Windows 10 or 11
- 4GB RAM or more
- 1GB free disk space
- Administrator access

## Step 1: Install Node.js

1. Download Node.js from the official website: https://nodejs.org/
2. Choose the LTS (Long Term Support) version (16.x or higher)
3. Run the installer and follow these steps:
   - Accept the license agreement
   - Select the installation location (default is recommended)
   - **Important**: Make sure the "Automatically install the necessary tools" option is checked
   - Click "Install" and wait for the installation to complete

## Step 2: Download ACDMS

1. Download the ACDMS application package 
2. Extract the ZIP file to a location on your computer (e.g., C:\ACDMS)
3. Make sure all files and folders are preserved during extraction

## Step 3: Set Up the Application

1. Open Command Prompt as Administrator:
   - Press the Windows key
   - Type "cmd"
   - Right-click on "Command Prompt" and select "Run as administrator"

2. Navigate to the ACDMS folder:
   ```
   cd C:\path\to\ACDMS
   ```
   (Replace "C:\path\to\ACDMS" with the actual path where you extracted the files)

3. Install the required dependencies:
   ```
   npm install
   ```
   This step requires an internet connection and might take a few minutes.

4. Initialize the database:
   ```
   node init-db.js
   ```
   You should see a message confirming successful initialization.

## Step 4: Create a Desktop Shortcut (Recommended)

1. Double-click on the `start_acdms.bat` file in the ACDMS folder to verify it works
2. To create a shortcut:
   - Right-click on `start_acdms.bat`
   - Select "Create shortcut"
   - Move the shortcut to your desktop
   - (Optional) Rename it to "ACDMS"

## Step 5: Starting the Application

1. Double-click on the `start_acdms.bat` file or the shortcut you created
2. A Command Prompt window will open showing the server status
3. Your default web browser will open automatically to http://localhost:5000
4. If the browser doesn't open automatically, open it manually and go to http://localhost:5000

## Login Information

- Username: `admin`
- Password: `ARCShillong`

## Using ACDMS

### Data Management

1. **Add Agniveer**: Fill out the form to add new recruits
2. **Search Database**: Find specific records using various criteria
3. **Data Management**: Edit, delete, import, and export records

### Import/Export Features

To import data:
1. Prepare an Excel file (.xlsx) or CSV file with Agniveer data
2. Column headers should match database field names: `name`, `batch_no`, `rank`, etc.
3. Go to Data Management > Import & Export section
4. Click "Import from File" and select your file

To export data:
1. Go to Data Management > Import & Export section
2. Choose "Export as CSV" or "Export as Excel"
3. The file will be automatically downloaded to your computer

## Troubleshooting

1. **Application won't start**:
   - Make sure Node.js is installed correctly
   - Check you've run `npm install` and `node init-db.js`
   - Try restarting your computer

2. **Import errors**:
   - Verify your Excel/CSV file has the correct column headers
   - Column headers should match these field names:
     - batch_no, number, rank, name, civil_education, etc.
   - Check for special characters or formatting that might cause issues

3. **"Port already in use" error**:
   - Another application is using port 5000
   - Close other applications or edit server.js to use a different port

4. **Database errors**:
   - Try reinitializing the database with `node init-db.js`

## Important Notes

- Keep the Command Prompt window open while using the application
- The application runs entirely on your local computer and doesn't require internet access (except during initial setup)
- All data is stored in the local database (db/agniveer.db)
- Make regular backups of your data using the Export feature

## Support

For technical support or assistance, please contact ARC Shillong support team.