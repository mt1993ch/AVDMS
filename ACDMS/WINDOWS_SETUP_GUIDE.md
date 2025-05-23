# ACDMS - Windows Setup Guide

This comprehensive guide will help you set up and run the Agniveer Centralised Data Management System (ACDMS) on your Windows computer for offline use.

## Prerequisites

1. Install Node.js
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version (16.x or higher)
   - During installation, make sure to check the option to install necessary tools

2. Download the ACDMS application files
   - Download the complete application folder with all files and directories intact

## Complete Installation Steps

1. Open Command Prompt as Administrator
   - Search for "Command Prompt" in the Start menu
   - Right-click and select "Run as administrator"

2. Navigate to the ACDMS folder
   ```
   cd path\to\your\acdms\folder
   ```

3. Install dependencies
   ```
   npm install
   ```
   This will install all required packages including express, better-sqlite3, and xlsx.
   This step requires an internet connection.

4. Initialize the database
   ```
   node init-db.js
   ```
   This will create the database structure and set up required tables.
   You should see a confirmation message when the database is successfully initialized.

5. Start the application
   ```
   node server.js
   ```
   You should see a message that the server is running on port 5000.

6. Access the application
   - Open your web browser (Chrome, Firefox, Edge, etc.)
   - Navigate to http://localhost:5000

## Login Information

- Username: admin
- Password: ARCShillong

## Using the Start Script (Recommended)

We've included a startup script for easier access:

1. In the ACDMS folder, you'll find a file named `start_acdms.bat`
2. Double-click this file to start the application
3. A Command Prompt window will open showing the server status
4. The application will automatically be available at http://localhost:5000
5. Keep the Command Prompt window open while using the application
6. When finished, close the Command Prompt window or press Ctrl+C

## Creating a Desktop Shortcut (Optional)

For even easier access:

1. Right-click on `start_acdms.bat` in the ACDMS folder
2. Select "Create shortcut"
3. Move the shortcut to your desktop
4. Rename it to "ACDMS" if desired

## Application Features

1. **Add New Agniveer**
   - Add complete details for new Agniveer recruits
   - All fields are organized in clear sections

2. **Search Database**
   - Find records using various search criteria
   - Use filters to narrow down results

3. **Data Management**
   - View, edit, or delete existing records
   - Search within the management view to find specific records

4. **Import/Export**
   - Import data from Excel spreadsheets
   - Export data to Excel for reporting or backup

## Data Backup Procedures

1. Regular backups
   - Use the Export feature in Data Management to create Excel backups
   - Store backups in a secure location

2. Database file backup
   - Locate the file `db/agniveer.db` in your ACDMS folder
   - Copy this file to a secure backup location periodically

3. Restore from backup
   - To restore from a database file backup, replace the existing `db/agniveer.db` with your backup file
   - To restore from Excel, use the Import feature

## Troubleshooting

1. If you see errors about missing dependencies:
   - Make sure you've run `npm install` successfully
   - Ensure you have a working internet connection during installation

2. If port 5000 is already in use:
   - Edit `server.js` and change the port number (e.g., from 5000 to another number)
   - Update your shortcuts and bookmarks accordingly

3. Database issues:
   - Run `node init-db.js` again to reinitialize the database
   - Ensure the `db` folder exists and is writable

4. Login problems:
   - Verify you're using the correct username (admin) and password (ARCShillong)
   - If issues persist, you may need to reinitialize the database

## Technical Information

- The application runs on Node.js using Express.js web server
- Data is stored in a SQLite database (`db/agniveer.db`)
- The application is completely offline and doesn't require internet after installation
- All searches and operations are performed locally on your computer

## Support and Assistance

For any issues or questions, please contact ARC Shillong support.