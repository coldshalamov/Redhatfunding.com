[CmdletBinding()]
param(
    [int]$Port = 5173
)

$ErrorActionPreference = 'Stop'

$CloudflaredUrl = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
$CloudflaredExe = Join-Path -Path (Join-Path $PSScriptRoot 'tools') -ChildPath 'cloudflared.exe'

function Write-Section {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

Ensure-Directory -Path (Join-Path $PSScriptRoot 'tools')

if (-not (Test-Path $CloudflaredExe)) {
    Write-Section "Downloading Cloudflare tunnel helper"
    $tempFile = [System.IO.Path]::GetTempFileName()
    try {
        Invoke-WebRequest -Uri $CloudflaredUrl -OutFile $tempFile
        Move-Item -Path $tempFile -Destination $CloudflaredExe -Force
    } finally {
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force
        }
    }
}

if (-not (Test-Path $CloudflaredExe)) {
    throw "cloudflared helper missing at $CloudflaredExe"
}

Write-Section "Starting preview tunnel (Cloudflare)"
Write-Host "Make sure the site is running locally (keep run-local.ps1 open)." -ForegroundColor Yellow

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $CloudflaredExe
$psi.Arguments = "tunnel --no-autoupdate --protocol http2 --url http://localhost:$Port"
$psi.WorkingDirectory = Split-Path $CloudflaredExe
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($psi)

try {
    $stdout = $process.StandardOutput
    $stderr = $process.StandardError
    $tunnelUrl = $null

    while (-not $process.HasExited) {
        while (-not $stdout.EndOfStream) {
            $line = $stdout.ReadLine()
            if ($line) {
                $match = [regex]::Match($line, 'https://[^\s"]+\.trycloudflare\.com')
                if ($match.Success) {
                    $tunnelUrl = $match.Value
                    break
                }
            }
        }

        if ($tunnelUrl) {
            break
        }

        Start-Sleep -Milliseconds 200
    }

    if (-not $tunnelUrl) {
        $errorText = $stderr.ReadToEnd()
        if (-not $errorText) {
            $errorText = "cloudflared exited with code $($process.ExitCode)"
        }
        throw "Tunnel failed to provide a URL. Details: $errorText"
    }

    Set-Clipboard $tunnelUrl
    Write-Host ""
    Write-Host "Tunnel ready! Share this link: $tunnelUrl" -ForegroundColor Green
    Write-Host "(Already copied to your clipboard.)"
    Write-Host ""
    Write-Host "Keep this window open while your boss reviews." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C here when you want to close the tunnel."
    Write-Host ""

    while (-not $process.HasExited) {
        while (-not $stdout.EndOfStream) {
            $line = $stdout.ReadLine()
            if ($line) {
                Write-Host "[tunnel] $line" -ForegroundColor DarkGray
            }
        }
        while (-not $stderr.EndOfStream) {
            $errLine = $stderr.ReadLine()
            if ($errLine) {
                Write-Warning "[tunnel] $errLine"
            }
        }
        Start-Sleep -Milliseconds 500
    }
} finally {
    if (-not $process.HasExited) {
        $process.Kill()
        $process.WaitForExit()
    }
}
