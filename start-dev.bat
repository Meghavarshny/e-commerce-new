@echo off
title E-Commerce Development Server
cd /d "%~dp0"

echo ============================================
echo   Starting E-Commerce Development Servers
echo ============================================
echo.
echo Backend  : http://localhost:5000
echo Frontend : http://localhost:5173
echo.
echo MongoDB must be running on localhost:27017
echo (or update MONGO_URI in backend/.env)
echo.
echo Close the backend/frontend windows to stop.
echo ============================================
echo.

:: Open backend in new PowerShell window
start "E-Commerce Backend" powershell -NoExit -Command "cd '%~dp0backend'; Write-Host 'Starting Backend...' -ForegroundColor Green; npm run dev"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: Open frontend in new PowerShell window
start "E-Commerce Frontend" powershell -NoExit -Command "cd '%~dp0frontend'; Write-Host 'Starting Frontend...' -ForegroundColor Green; npx vite --host"

echo.
echo Both servers are starting up.
echo Close the server windows to stop them.
echo.
pause
