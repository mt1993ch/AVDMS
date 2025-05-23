@echo off
echo Starting ACDMS - Agniveer Centralised Data Management System
echo.
echo Server starting at http://localhost:5000
echo Please wait...
echo.
echo IMPORTANT: Do not close this window while using the application.
echo Press Ctrl+C to stop the server when finished.
echo.
cd /d %~dp0
node server.js
pause