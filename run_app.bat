@echo off
echo Starting Modern E-Commerce Application...

:: Start Backend in a new window
echo Starting Backend...
start "E-Commerce Backend" cmd /k "cd backend && npm.cmd run dev"

:: Start Frontend in a new window
echo Starting Frontend...
start "E-Commerce Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo Both applications are starting in separate windows.
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
pause
