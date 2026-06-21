@echo off
setlocal

cd /d "%~dp0"

set "PORT=5173"
if not "%~1"=="" set "PORT=%~1"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

set "LAN_IP="
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /c:"IPv4 Address" /c:"IPv4"') do (
  for /f "tokens=* delims= " %%B in ("%%A") do (
    echo %%B | findstr /r "^192\.168\. ^10\. ^172\." >nul
    if not errorlevel 1 if not defined LAN_IP set "LAN_IP=%%B"
  )
)

echo.
echo ==========================================
echo  MistHustlers Network Preview
echo ==========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host ''; Write-Host '================ LOCAL LINK ================' -ForegroundColor Cyan; Write-Host 'Open on this laptop:' -ForegroundColor White; Write-Host '  http://localhost:%PORT%' -ForegroundColor Yellow; Write-Host '============================================' -ForegroundColor Cyan"
echo.
if defined LAN_IP (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host ''; Write-Host '============== SAME WI-FI LINK =============' -ForegroundColor Green; Write-Host 'Send this to phone/laptop on same Wi-Fi:' -ForegroundColor White; Write-Host '  http://%LAN_IP%:%PORT%' -ForegroundColor Yellow; Write-Host '============================================' -ForegroundColor Green"
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host ''; Write-Host '=========== SAME WI-FI LINK NOT FOUND ======' -ForegroundColor Red; Write-Host 'Could not detect LAN IP. Run ipconfig and use your IPv4 address.' -ForegroundColor Yellow; Write-Host '============================================' -ForegroundColor Red"
)
echo.
echo Keep this window open while others view the site.
echo Laptop and other device must be on the same Wi-Fi/LAN.
echo If another device cannot open it, allow Node.js in Windows Firewall.
echo You can also try a different port: network.bat 5174
echo.
echo Note: This starts the public frontend preview only.
echo Forms/admin API need the backend running with DATABASE_URL.
echo.

call npx vite --host 0.0.0.0 --port %PORT% --strictPort --configLoader native

echo.
echo Network preview stopped.
pause
