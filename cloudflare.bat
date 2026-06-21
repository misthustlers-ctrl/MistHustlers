@echo off
setlocal

cd /d "%~dp0"

set "PORT=5173"
if not "%~1"=="" set "PORT=%~1"

set "CLOUDFLARED=C:\tmp\cloudflared.exe"
set "LOG_FILE=%~dp0cloudflare-url.txt"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist "%CLOUDFLARED%" (
  echo cloudflared.exe was not found at:
  echo   %CLOUDFLARED%
  echo.
  echo Download cloudflared.exe and place it there, then run this file again.
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

echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host ''; Write-Host '============================================' -ForegroundColor Cyan; Write-Host ' MistHustlers Cloudflare Public Preview' -ForegroundColor White; Write-Host '============================================' -ForegroundColor Cyan; Write-Host ''; Write-Host '================ LOCAL LINK ================' -ForegroundColor Cyan; Write-Host 'Open on this laptop:' -ForegroundColor White; Write-Host '  http://localhost:%PORT%' -ForegroundColor Yellow; Write-Host '============================================' -ForegroundColor Cyan"
echo.
echo Starting local Vite server in a separate window...
echo Keep both windows open while sharing the site.
echo.

start "MistHustlers Local Server" /D "%~dp0" cmd /k "npx vite --host 127.0.0.1 --port %PORT% --strictPort --configLoader native"

echo Waiting for local server to start on http://localhost:%PORT% ...
set "READY="
for /l %%I in (1,1,20) do (
  curl.exe -s -I http://localhost:%PORT% >nul 2>nul
  if not errorlevel 1 (
    set "READY=1"
    goto server_ready
  )
  timeout /t 1 /nobreak >nul
)

:server_ready
if not defined READY (
  echo.
  echo Local server did not start on port %PORT%.
  echo Close old Vite/Node windows, or try: cloudflare.bat 5174
  pause
  exit /b 1
)

echo.
echo Starting Cloudflare Tunnel...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host ''; Write-Host '============= PUBLIC INTERNET LINK =========' -ForegroundColor Green; Write-Host 'Cloudflare will print a URL like:' -ForegroundColor White; Write-Host '  https://xxxxx.trycloudflare.com' -ForegroundColor Yellow; Write-Host 'Send that URL to anyone.' -ForegroundColor White; Write-Host 'Logs will also be saved here:' -ForegroundColor Gray; Write-Host '  %LOG_FILE%' -ForegroundColor Yellow; Write-Host '============================================' -ForegroundColor Green"
echo This temporary URL works over the internet until you close this window.
echo.
echo Note: This shares the public frontend preview. Admin/forms need backend/database if you want them fully working.
echo.

if exist "%LOG_FILE%" del "%LOG_FILE%"
"%CLOUDFLARED%" tunnel --no-autoupdate --url http://localhost:%PORT% 2>&1 | powershell -NoProfile -ExecutionPolicy Bypass -Command "$urlPattern = 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com'; $input | ForEach-Object { $_ | Tee-Object -FilePath '%LOG_FILE%' -Append; if ($_ -match $urlPattern) { Write-Host ''; Write-Host '============= COPY THIS PUBLIC URL =========' -ForegroundColor Green; Write-Host ('  ' + $Matches[0]) -ForegroundColor Yellow; Write-Host '============================================' -ForegroundColor Green; Write-Host '' } }"

echo.
echo Cloudflare tunnel stopped.
echo If you missed the URL, check:
echo   %LOG_FILE%
pause
