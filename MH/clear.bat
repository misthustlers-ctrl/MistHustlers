@echo off
setlocal

set "ROOT=%~dp0misthustlers-merged-app"
set "FRONTEND=%ROOT%"
set "BACKEND=%ROOT%\backend"

echo Stopping MistHustlers frontend and backend...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$frontend = (Resolve-Path -LiteralPath '%FRONTEND%').Path.ToLower();" ^
  "$backend = (Resolve-Path -LiteralPath '%BACKEND%').Path.ToLower();" ^
  "$ids = New-Object System.Collections.Generic.HashSet[int];" ^
  "Get-NetTCPConnection -LocalPort 9000,5173 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { [void]$ids.Add([int]$_.OwningProcess) };" ^
  "try { " ^
  "  Get-CimInstance Win32_Process | Where-Object { " ^
  "    $low = ([string]$_.CommandLine).ToLower(); " ^
  "    (($low.Contains($frontend) -and ($low.Contains('vite') -or $low.Contains('npm.cmd run dev') -or $low.Contains('npm run dev'))) -or " ^
  "     ($low.Contains($backend) -and ($low.Contains('server.js') -or $low.Contains('npm.cmd run dev') -or $low.Contains('npm run dev')))) " ^
  "  } | ForEach-Object { [void]$ids.Add([int]$_.ProcessId) } " ^
  "} catch { Write-Host 'Command-line scan skipped; using project ports only.' }" ^
  "$targets = $ids | Where-Object { $_ -gt 0 } | Sort-Object -Unique;" ^
  "if (-not $targets) { Write-Host 'No MistHustlers frontend/backend process found.'; exit 0 }" ^
  "$targets | ForEach-Object { Write-Host ('Stopping PID ' + $_); Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo Done.
endlocal
