@echo off
echo ===================================
echo    PLACIFY FEEDBACK SERVER
echo ===================================
echo.

cd /d "d:\1-coding\GSSoC'25\Placify-Smarter_Placements-Sharper_Talent\server"

echo Starting simplified email server...
echo No MongoDB required - just email functionality!
echo.
echo Server will be available at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
