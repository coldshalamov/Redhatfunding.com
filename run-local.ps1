[CmdletBinding()]
param(
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

$NodeVersion = '20.17.0'
$NodeDistName = "node-v$NodeVersion-win-x64"

function Write-Section {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Ensure-Command {
    param(
        [string]$Command,
        [string]$FriendlyName
    )
    $result = Get-Command $Command -ErrorAction SilentlyContinue
    if (-not $result) {
        throw "$FriendlyName (`$Command`) is required but was not found on PATH."
    }
    return $result
}

function Ensure-EnvFile {
    param([string]$DirectoryPath)
    $envPath = Join-Path $DirectoryPath ".env"
    $examplePath = Join-Path $DirectoryPath ".env.example"

    if (-not (Test-Path $envPath) -and (Test-Path $examplePath)) {
        Copy-Item $examplePath $envPath
        Write-Host "Created $(Resolve-Path $envPath) from example template."
    }
}

function Normalize-AllowedOrigins {
    param([string]$EnvPath)

    if (-not (Test-Path $EnvPath)) {
        return
    }

    $content = Get-Content $EnvPath -Raw
    $pattern = '(?m)^ALLOWED_ORIGINS=(.*)$'
    $match = [regex]::Match($content, $pattern)
    if (-not $match.Success) {
        return
    }

    $currentValue = $match.Groups[1].Value.Trim()
    if (-not $currentValue) {
        $normalized = '["http://localhost:5173"]'
    } elseif ($currentValue.StartsWith('[')) {
        return
    } else {
        $parts = $currentValue -split '\s*,\s*' | Where-Object { $_ }
        if ($parts.Count -eq 0) {
            $parts = @('http://localhost:5173')
        }
        $quoted = $parts | ForEach-Object { '"' + $_ + '"' }
        $normalized = '[' + ($quoted -join ', ') + ']'
    }

    $newLine = "ALLOWED_ORIGINS=$normalized"
    $updated = [regex]::Replace($content, $pattern, $newLine)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($EnvPath, $updated, $utf8NoBom)
    Write-Host "Normalized ALLOWED_ORIGINS in $EnvPath to $normalized"
}

function Ensure-PortableNode {
    param(
        [string]$DestinationRoot
    )

    $nodeDir = Join-Path $DestinationRoot $NodeDistName
    $nodeExe = Join-Path $nodeDir "node.exe"

    if (Test-Path $nodeExe) {
        return $nodeDir
    }

    Write-Section "Downloading Node.js $NodeVersion (portable)"

    $downloadUrl = "https://nodejs.org/dist/v$NodeVersion/$NodeDistName.zip"
    $tempZip = [System.IO.Path]::GetTempFileName() + ".zip"

    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip
        if (Test-Path $nodeDir) {
            Remove-Item $nodeDir -Recurse -Force
        }
        Expand-Archive -Path $tempZip -DestinationPath $DestinationRoot
    } finally {
        if (Test-Path $tempZip) {
            Remove-Item $tempZip -Force
        }
    }

    if (-not (Test-Path $nodeExe)) {
        throw "Failed to provision portable Node.js runtime at $nodeDir"
    }

    return $nodeDir
}

function Reset-StaleSqliteDatabase {
    param(
        [string]$PythonExe,
        [string]$DatabasePath
    )

    if (-not (Test-Path $DatabasePath)) {
        return
    }

    $checkScript = @'
import sqlite3
import sys
from pathlib import Path

db_path = Path(sys.argv[1])
if not db_path.exists():
    sys.exit(2)

conn = sqlite3.connect(db_path)
try:
    row = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='alembic_version'"
    ).fetchone()
finally:
    conn.close()

sys.exit(0 if row else 1)
'@

    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $checkScript -Encoding ASCII

    & $PythonExe $tempFile $DatabasePath
    $exitCode = $LASTEXITCODE

    Remove-Item $tempFile -Force

    if ($exitCode -eq 0) {
        return
    }

    if ($exitCode -eq 1) {
        Write-Host "Removing stale SQLite database at $DatabasePath (no alembic_version table found)." -ForegroundColor Yellow
        Remove-Item $DatabasePath -Force
        return
    }

    throw "Failed to inspect SQLite database at $DatabasePath (exit code $exitCode)."
}

function Get-NpmExecutablePath {
    param(
        [string]$NodeDirectory
    )

    $npmCmd = Join-Path $NodeDirectory "npm.cmd"
    if (Test-Path $npmCmd) {
        return $npmCmd
    }

    throw "npm executable not found in portable Node directory $NodeDirectory"
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptRoot) {
    $scriptRoot = Get-Location
}
Set-Location $scriptRoot

$frontendDir = Join-Path $scriptRoot "frontend"
$backendDir = Join-Path $scriptRoot "backend"
$venvDir = Join-Path $backendDir ".venv"
$venvPython = Join-Path $venvDir "Scripts\\python.exe"
$frontendNodeModules = Join-Path $frontendDir "node_modules"
$viteEntry = Join-Path $frontendDir "node_modules\\vite\\bin\\vite.js"
$toolsDir = Join-Path $scriptRoot "tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$portableNodeDir = Ensure-PortableNode -DestinationRoot $toolsDir
$nodeExecutable = Join-Path $portableNodeDir "node.exe"
$npmPath = Get-NpmExecutablePath -NodeDirectory $portableNodeDir

Write-Section "Checking prerequisites"

$pythonExecutable = $null
$pythonPrefix = @()
$pythonVersionOutput = $null

$pyLauncher = Get-Command "py" -ErrorAction SilentlyContinue
if ($pyLauncher) {
    try {
        $output = & $pyLauncher.Path "-3.11" "--version" 2>$null
        if ($output -match "3\.1[1-9]\.") {
            $pythonExecutable = $pyLauncher.Path
            $pythonPrefix = @("-3.11")
            $pythonVersionOutput = $output
        }
    } catch {
        # Ignore launcher failures; we will fall back to python.exe
    }
}

if (-not $pythonExecutable) {
    $pythonCmd = Ensure-Command -Command "python" -FriendlyName "Python"
    $output = & $pythonCmd.Path "--version"
    if (-not ($output -match "3\.1[1-9]\.")) {
        throw "Python 3.11+ is required. Found: $output"
    }
    $pythonExecutable = $pythonCmd.Path
    $pythonVersionOutput = $output
}

Write-Host ("Node (portable): {0}" -f ((& $nodeExecutable "-v").Trim()))
Write-Host ("npm: {0}" -f ((& $npmPath "--version").Trim()))
Write-Host ("Python: {0}" -f ($pythonVersionOutput.Trim()))

Write-Section "Preparing environment files"
Ensure-EnvFile -DirectoryPath $frontendDir
Ensure-EnvFile -DirectoryPath $backendDir

Normalize-AllowedOrigins -EnvPath (Join-Path $backendDir ".env")

if (-not (Test-Path $frontendDir)) {
    throw "Frontend directory not found at $frontendDir"
}

if (-not (Test-Path $backendDir)) {
    throw "Backend directory not found at $backendDir"
}

$needsFrontendInstall = -not (Test-Path $frontendNodeModules)
$needsBackendInstall = -not (Test-Path $venvPython)

if ($SkipInstall -and ($needsFrontendInstall -or $needsBackendInstall)) {
    Write-Host "Dependencies missing; running installers despite -SkipInstall." -ForegroundColor Yellow
    $SkipInstall = $false
}

if (-not $SkipInstall) {
    Write-Section "Installing frontend dependencies"
    Push-Location $frontendDir
    try {
        & $npmPath "install"
    } finally {
        Pop-Location
    }

    Write-Section "Setting up backend virtual environment"
    if (-not (Test-Path $venvPython)) {
        $createArgs = $pythonPrefix + @("-m", "venv", $venvDir)
        & $pythonExecutable @createArgs
    }

    Push-Location $backendDir
    try {
        & $venvPython "-m" "pip" "install" "--upgrade" "pip"
        & $venvPython "-m" "pip" "install" "-e" ".[dev]"
    } finally {
        Pop-Location
    }
}

if (-not (Test-Path $venvPython)) {
    throw "Backend virtual environment not found at $venvPython. Re-run this script without -SkipInstall to set it up."
}

if (-not (Test-Path $frontendNodeModules)) {
    throw "Frontend dependencies (node_modules) are missing. Re-run the script without -SkipInstall."
}

if (-not (Test-Path $viteEntry)) {
    throw "Vite binary not found at $viteEntry. Re-run the script without -SkipInstall."
}

Write-Section "Applying database migrations"
Push-Location $backendDir
try {
    $databaseUrlOutput = (& $venvPython "-c" "from app.config import get_settings; print(get_settings().database_url)")
    $databaseUrl = $databaseUrlOutput.Trim()
    if ($databaseUrl -match '^sqlite\+aiosqlite:///\.?/?(.+)$') {
        $sqliteRelative = $Matches[1]
        $sqlitePath = Join-Path $backendDir $sqliteRelative
        Reset-StaleSqliteDatabase -PythonExe $venvPython -DatabasePath $sqlitePath
    }

    & $venvPython "-m" "alembic" "upgrade" "head"
} finally {
    Pop-Location
}

Write-Section "Launching backend server"
Start-Process -FilePath $venvPython -ArgumentList @("-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload") -WorkingDirectory $backendDir

Write-Section "Launching frontend dev server"
Start-Process -FilePath $nodeExecutable -ArgumentList @($viteEntry, "--host") -WorkingDirectory $frontendDir

Write-Section "Opening browser"
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "The dev servers are running in two new terminal windows." -ForegroundColor Green
Write-Host "If your browser did not open, visit http://localhost:5173 manually." -ForegroundColor Yellow
Write-Host ""
[void](Read-Host "Press Enter to close this launcher")


