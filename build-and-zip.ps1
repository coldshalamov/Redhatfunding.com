# Build Vite app and package for cPanel deploy
Continue = 'Stop'

 = Split-Path -Parent System.Management.Automation.InvocationInfo.MyCommand.Path
 = Join-Path  'frontend'
 = Join-Path  'dist'
 = Join-Path  'deploy.zip'

# Clean previous
if (Test-Path ) { Remove-Item -Recurse -Force  }
if (Test-Path ) { Remove-Item -Force  }

Push-Location 

# Install & build
if (Test-Path 'package-lock.json') { npm ci } else { npm install }
npm run build

# Copy dist to repo root /dist
Pop-Location
Copy-Item -Recurse -Force (Join-Path  'dist') 

# Ensure .htaccess is included (copy from frontend to dist root)
Copy-Item -Force (Join-Path  '.htaccess') (Join-Path  '.htaccess')

# Zip the *contents* of dist (not the folder) to deploy.zip
Add-Type -A 'System.IO.Compression.FileSystem'
 = Join-Path  'dist-temp'
if (Test-Path ) { Remove-Item -Recurse -Force  }
New-Item -Type Directory  | Out-Null
Copy-Item -Recurse -Force (Join-Path  '*') 
if (Test-Path ) { Remove-Item  -Force }
[IO.Compression.ZipFile]::CreateFromDirectory(, )
Remove-Item -Recurse -Force 

Write-Host 'Build complete. Upload deploy.zip to cPanel public_html and Extract.'

