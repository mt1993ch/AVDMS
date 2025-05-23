# ACDMS - Agniveer Centralised Data Management System

## Overview

The Agniveer Centralised Data Management System (ACDMS) is a complete offline data management application designed for managing recruit information. This system runs as a standalone web application on your local computer and doesn't require internet connectivity after installation.

## Key Features

- **Secure Login**: Password-protected access to the system
- **Add New Agniveer**: Complete form for adding recruit details with comprehensive fields
- **Search Database**: Powerful search functionality with multiple filter options
- **Data Management**: View, edit, and delete records with easy-to-use interface
- **Import/Export**: Transfer data to and from Excel spreadsheets
- **Integrated Help**: Built-in chatbot for assistance with system functions

## System Requirements

- Windows 7, 8, 10, or 11
- Node.js v14 or higher
- 100 MB free disk space
- 4 GB RAM (recommended)
- Any modern web browser (Chrome, Firefox, Edge, etc.)

## Contents of This Package

- `server.js`: Main application server file
- `init-db.js`: Database initialization script
- `start_acdms.bat`: Quick start script for Windows
- `package.json`: Application configuration and dependencies
- `db/`: Database folder (created during installation)
- `public/`: Web application files and resources
- `WINDOWS_SETUP_GUIDE.md`: Detailed installation instructions

## Installation

Please follow the instructions in `WINDOWS_SETUP_GUIDE.md` for complete setup steps.

## Quick Start

After installation:
1. Double-click `start_acdms.bat`
2. Open your web browser and navigate to http://localhost:5000
3. Login with the credentials:
   - Username: admin
   - Password: ARCShillong

## Data Management

All data is stored locally in a SQLite database file (`db/agniveer.db`). Regular backups are recommended using the Export feature in the application.

## Technology Stack

- Backend: Node.js with Express
- Database: SQLite (better-sqlite3)
- Frontend: HTML5, CSS3, JavaScript, Bootstrap
- Excel Integration: SheetJS (xlsx)

## Contact Information

For support or inquiries, please contact ARC Shillong.