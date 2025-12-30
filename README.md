# RedHat Funding Website

Business funding application website with document upload functionality.

## 🚀 Automatic Deployment Setup

This repository is configured to automatically deploy to GoDaddy cPanel whenever you push changes to the `master` branch.

### Setup Instructions:

#### 1. Get your GoDaddy FTP credentials from cPanel:
   - Log into your GoDaddy cPanel
   - Go to **Files** → **FTP Accounts**
   - Note your FTP credentials:
     - **FTP Server**: Usually `ftp.redhatfunding.com` or your domain
     - **FTP Username**: Your cPanel username (or create a new FTP account)
     - **FTP Password**: Your FTP password
     - **Server Directory**: Usually `/public_html` or `/public_html/redhatfunding.com`

#### 2. Add secrets to your GitHub repository:
   - Go to your GitHub repository: https://github.com/coldshalamov/Redhatfunding.com
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret** and add these four secrets:

   | Secret Name | Value | Example |
   |------------|-------|---------|
   | `FTP_SERVER` | Your FTP server address | `ftp.redhatfunding.com` |
   | `FTP_USERNAME` | Your FTP username | `youruser@redhatfunding.com` |
   | `FTP_PASSWORD` | Your FTP password | `your-secure-password` |
   | `FTP_SERVER_DIR` | Remote directory path | `/public_html/` |

#### 3. Test the deployment:
   - Make any small change to a file
   - Commit and push to GitHub:
     ```bash
     git add .
     git commit -m "Test auto-deployment"
     git push origin master
     ```
   - Go to **Actions** tab in your GitHub repo to watch the deployment

#### 4. Done! 🎉
   From now on, every time you push to `master`, your website will automatically update on GoDaddy!

---

## 📁 Project Structure

```
RedhatFunding/
├── index.html              # Main landing page
├── upload-documents.html   # Document upload form
├── thank-you.html         # Confirmation page
├── assets/                # CSS and JS bundles
├── brand/                 # Logo and branding assets
├── img/                   # Images
└── .github/workflows/     # Auto-deployment configuration
```

## 🔧 Local Development

To run the site locally:

1. Open `launch-site.bat` (Windows)
2. Or use any local web server:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000`

## 📝 Making Changes

1. Edit files locally
2. Test in your browser
3. Commit changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin master
   ```
4. Wait ~1-2 minutes for automatic deployment to GoDaddy

## 🆘 Troubleshooting

- **Deployment failed?** Check the Actions tab in GitHub for error messages
- **Files not updating?** Verify your FTP credentials in GitHub Secrets
- **Wrong directory?** Update `FTP_SERVER_DIR` secret to match your cPanel path

---

**Website:** https://redhatfunding.com  
**Phone:** 1-561-758-3634  
**Email:** funding@redhatfunding.com
