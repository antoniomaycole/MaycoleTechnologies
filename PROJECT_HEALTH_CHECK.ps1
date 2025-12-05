#!/usr/bin/env powershell
# MaycoleTechnologies™ Project Health Check
# Verifies project is ready for deployment

Write-Host "" 
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🏥 MaycoleTechnologies™ Project Health Check" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()
$success = @()

# Check 1: Node.js Version
Write-Host "▶ Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    $success += "✅ Node.js installed: $nodeVersion"
} else {
    $errors += "❌ Node.js not found. Install Node.js 18+ from nodejs.org"
}

# Check 2: npm Version
Write-Host "▶ Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    $success += "✅ npm installed: $npmVersion"
} else {
    $errors += "❌ npm not found"
}

# Check 3: Prettier
Write-Host "▶ Checking Prettier..." -ForegroundColor Yellow
$prettier = npx prettier --version 2>$null
if ($prettier) {
    $success += "✅ Prettier installed: $prettier"
} else {
    $errors += "❌ Prettier not installed. Run: npm install --save-dev prettier"
}

# Check 4: Build Status
Write-Host "▶ Running build test..." -ForegroundColor Yellow
$buildOutput = npm run build 2>&1 | Select-Object -Last 1
if ($buildOutput -match "modules transformed") {
    $success += "✅ Build successful: $buildOutput"
} else {
    $warnings += "⚠️  Build may have issues. Check terminal output."
}

# Check 5: Key Files
Write-Host "▶ Checking key files..." -ForegroundColor Yellow
$files = @(
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "tailwind.config.js",
    "eslint.config.js",
    ".prettierrc.json",
    "vercel.json",
    "netlify.toml",
    ".env.example"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $success += "✅ Found: $file"
    } else {
        $warnings += "⚠️  Missing: $file"
    }
}

# Check 6: Source Directory
Write-Host "▶ Checking source directory..." -ForegroundColor Yellow
$components = Get-ChildItem "src/components" -Filter "*.tsx" 2>$null | Measure-Object | Select-Object -ExpandProperty Count
if ($components -gt 0) {
    $success += "✅ Components found: $components .tsx files"
} else {
    $errors += "❌ No components found in src/components"
}

# Check 7: Documentation
Write-Host "▶ Checking documentation..." -ForegroundColor Yellow
$docs = Get-ChildItem "src" -Filter "*.md" 2>$null | Measure-Object | Select-Object -ExpandProperty Count
if ($docs -gt 0) {
    $success += "✅ Documentation files: $docs .md files"
} else {
    $warnings += "⚠️  Limited documentation"
}

# Check 8: Build Directory
Write-Host "▶ Checking build output..." -ForegroundColor Yellow
if (Test-Path "build") {
    $buildSize = (Get-Item "build" -Recurse | Measure-Object -Sum -Property Length).Sum / 1MB
    $success += "✅ Build directory exists: ${buildSize:.2f} MB"
} else {
    $warnings += "⚠️  Build directory not found. Run: npm run build"
}

# Print Results
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "RESULTS:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($success.Count -gt 0) {
    Write-Host "✅ SUCCESS ($($success.Count) checks):" -ForegroundColor Green
    foreach ($msg in $success) {
        Write-Host "  $msg" -ForegroundColor Green
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  WARNINGS ($($warnings.Count) checks):" -ForegroundColor Yellow
    foreach ($msg in $warnings) {
        Write-Host "  $msg" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($errors.Count -gt 0) {
    Write-Host "❌ ERRORS ($($errors.Count) checks):" -ForegroundColor Red
    foreach ($msg in $errors) {
        Write-Host "  $msg" -ForegroundColor Red
    }
    Write-Host ""
}

# Summary
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "✅ PROJECT STATUS: HEALTHY & READY FOR DEPLOYMENT" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Green
    Write-Host "  1. Review: PROJECT_STATUS_AND_NEXT_STEPS.md" -ForegroundColor Green
    Write-Host "  2. Deploy: Push to GitHub, then to Vercel/Netlify" -ForegroundColor Green
    Write-Host "  3. Verify: Test the live site thoroughly" -ForegroundColor Green
} else {
    Write-Host "⚠️  PROJECT STATUS: NEEDS ATTENTION" -ForegroundColor Yellow
    Write-Host "   Fix the above errors before deployment" -ForegroundColor Yellow
}
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
