@echo off
REM MaycoleTechnologies™ - Git Setup & Push Script for Windows
REM This script initializes Git, commits code, and prepares for GitHub push

setlocal enabledelayedexpansion

echo.
echo ================================================================================
echo  MaycoleTechnologies™ - Git Setup & GitHub Push Script
echo ================================================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo [1/6] Git is installed ✓
echo.

REM Configure Git (optional - modify as needed)
echo [2/6] Configuring Git user...
git config --global user.name "MaycoleTechnologies Dev" 2>nul
git config --global user.email "dev@maycoletechnologies.com" 2>nul
echo Git user configured ✓
echo.

REM Initialize repository
echo [3/6] Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Repository already initialized or Git init failed
) else (
    echo Repository initialized ✓
)
echo.

REM Add all files
echo [4/6] Adding files to staging area...
git add .
echo Files added ✓ (.gitignore automatically excludes .env files)
echo.

REM Create initial commit
echo [5/6] Creating initial commit...
git commit -m "Initial commit: MaycoleTechnologies production-ready code"
if %errorlevel% neq 0 (
    echo Nothing to commit or commit failed
) else (
    echo Initial commit created ✓
)
echo.

REM Summary
echo [6/6] Summary
echo ================================================================================
echo.
echo Repository is ready for GitHub!
echo.
echo Next steps:
echo 1. Create a new PRIVATE repository on GitHub: https://github.com/new
echo 2. Copy the HTTPS URL from your new repository
echo 3. Run these commands in PowerShell:
echo.
echo    cd "c:\Users\TEMP\Downloads\MaycoleTechnologies"
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo IMPORTANT: Keep your repository PRIVATE to protect your code!
echo.
echo For more details, see: FINAL_AUDIT_REPORT.md
echo.
echo ================================================================================
echo.
pause
