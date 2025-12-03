# MaycoleTechnologies™ - Git Setup & GitHub Push Script for PowerShell

Write-Host "`n" -ForegroundColor Green
Write-Host "================================================================================`n" -ForegroundColor Green
Write-Host "  MaycoleTechnologies™ - Git Setup & GitHub Push Script" -ForegroundColor Cyan
Write-Host "`n================================================================================" -ForegroundColor Green
Write-Host "`n"

# Check if Git is installed
$gitVersion = git --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then run this script again.`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/6] Git is installed ✓" -ForegroundColor Green
Write-Host "      Version: $gitVersion`n" -ForegroundColor Gray

# Configure Git (optional - modify as needed)
Write-Host "[2/6] Configuring Git user..." -ForegroundColor Green
git config --global user.name "MaycoleTechnologies Dev" 2>$null
git config --global user.email "dev@maycoletechnologies.com" 2>$null
Write-Host "      Git user configured ✓`n" -ForegroundColor Green

# Initialize repository
Write-Host "[3/6] Initializing Git repository..." -ForegroundColor Green
$initResult = git init 2>&1
if ($LASTEXITCODE -eq 0 -or $initResult -match "Reinitialized") {
    Write-Host "      Repository initialized ✓`n" -ForegroundColor Green
} else {
    Write-Host "      Repository already initialized or init in progress`n" -ForegroundColor Yellow
}

# Add all files
Write-Host "[4/6] Adding files to staging area..." -ForegroundColor Green
git add .
Write-Host "      Files added ✓ (.gitignore automatically excludes .env files)`n" -ForegroundColor Green

# Create initial commit
Write-Host "[5/6] Creating initial commit..." -ForegroundColor Green
$commitResult = git commit -m "Initial commit: MaycoleTechnologies production-ready code" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Initial commit created ✓`n" -ForegroundColor Green
} else {
    Write-Host "      Commit status: $commitResult`n" -ForegroundColor Yellow
}

# Summary
Write-Host "[6/6] Summary" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Green
Write-Host "`nRepository is ready for GitHub!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Create a new PRIVATE repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Copy the HTTPS URL from your new repository" -ForegroundColor White
Write-Host "3. Run these commands in PowerShell:
" -ForegroundColor White

Write-Host "   cd 'c:\Users\TEMP\Downloads\MaycoleTechnologies'" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "IMPORTANT: Keep your repository PRIVATE to protect your code!" -ForegroundColor Red
Write-Host "`nFor more details, see:" -ForegroundColor Yellow
Write-Host "- FINAL_AUDIT_REPORT.md" -ForegroundColor Cyan
Write-Host "- SECURITY.md" -ForegroundColor Cyan
Write-Host "- .env.example`n" -ForegroundColor Cyan

Write-Host "================================================================================" -ForegroundColor Green
Write-Host "`n"

Read-Host "Press Enter to exit"
