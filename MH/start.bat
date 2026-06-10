@echo off
title MistHustlers App
cd /d "%~dp0misthustlers-merged-app"

echo [MistHustlers] Starting Backend...
start "MistHustlers-Backend" /min cmd /c "cd /d backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [MistHustlers] Starting Frontend...
start "MistHustlers-Frontend" /min cmd /c "npm run dev"

timeout /t 2 /nobreak >nul
echo [MistHustlers] Both servers starting...
echo   Backend  : http://localhost:9000
echo   Frontend : http://localhost:5173
echo.
pause
