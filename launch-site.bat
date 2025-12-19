@echo off
setlocal

rem Serve the site from this folder on http://localhost:8080 and open it.
cd /d "%~dp0"
set "PORT=8080"

rem Pick available Python launcher.
set "PY_RUNNER="
where py >nul 2>nul && set "PY_RUNNER=py"
if not defined PY_RUNNER (
  where python >nul 2>nul && set "PY_RUNNER=python"
)

if not defined PY_RUNNER (
  echo Could not find Python. Install Python, or run: py -m http.server 8080
  pause
  exit /b 1
)

rem Use the SPA-aware server so /apply, /privacy, etc. work on refresh/open in new tab.
start "" %PY_RUNNER% "%~dp0spa_dev_server.py"
timeout /t 2 >nul
start "" http://localhost:%PORT%/

echo Site served at http://localhost:%PORT%/ with SPA fallback.
echo Close the server window to stop it.
pause
