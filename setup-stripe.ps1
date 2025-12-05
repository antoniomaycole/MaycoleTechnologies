#!/usr/bin/env pwsh

# Stripe Integration Setup Script for MaycoleTechnologies
# This script helps configure Stripe for local development

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Stripe Integration Setup for Windows    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if .env.local exists
Write-Host "Step 1: Creating .env.local file..." -ForegroundColor Green
if (Test-Path ".env.local") {
    Write-Host "  ✓ .env.local already exists" -ForegroundColor Green
} else {
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
        Write-Host "  ✓ Created .env.local from .env.local.example" -ForegroundColor Green
    } else {
        Write-Host "  ✗ .env.local.example not found!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2: Enter your Stripe test keys" -ForegroundColor Green
Write-Host "  (Get from: https://dashboard.stripe.com/apikeys)" -ForegroundColor Yellow
Write-Host ""

# Get Stripe Public Key
$publicKey = Read-Host "  Enter Stripe Public Key (pk_test_...)"
if (-not $publicKey) {
    Write-Host "  ✗ Public key is required!" -ForegroundColor Red
    exit 1
}

# Get Stripe Secret Key
$secretKey = Read-Host "  Enter Stripe Secret Key (sk_test_...)"
if (-not $secretKey) {
    Write-Host "  ✗ Secret key is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Enter your Stripe Price IDs" -ForegroundColor Green
Write-Host "  (Get from: https://dashboard.stripe.com/products)" -ForegroundColor Yellow
Write-Host ""

$profMonthlyPrice = Read-Host "  Enter Professional Monthly Price ID (price_...)"
if (-not $profMonthlyPrice) {
    Write-Host "  ✗ Price ID is required!" -ForegroundColor Red
    exit 1
}

$entMonthlyPrice = Read-Host "  Enter Enterprise Monthly Price ID (price_...)"
if (-not $entMonthlyPrice) {
    Write-Host "  ✗ Price ID is required!" -ForegroundColor Red
    exit 1
}

# Update .env.local
Write-Host ""
Write-Host "Step 4: Updating .env.local..." -ForegroundColor Green

$envContent = Get-Content ".env.local" -Raw

# Replace values
$envContent = $envContent -replace 'VITE_STRIPE_PUBLIC_KEY=.*', "VITE_STRIPE_PUBLIC_KEY=$publicKey"
$envContent = $envContent -replace 'STRIPE_SECRET_KEY=.*', "STRIPE_SECRET_KEY=$secretKey"
$envContent = $envContent -replace 'VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=.*', "VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=$profMonthlyPrice"
$envContent = $envContent -replace 'VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=.*', "VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=$entMonthlyPrice"

Set-Content ".env.local" $envContent

Write-Host "  ✓ Updated .env.local with your Stripe keys" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Verifying npm packages..." -ForegroundColor Green

# Check if Stripe is in package.json
$packageJson = Get-Content "package.json" -Raw
if ($packageJson -match '"stripe"') {
    Write-Host "  ✓ Stripe package found in package.json" -ForegroundColor Green
} else {
    Write-Host "  ℹ Stripe package not in package.json (may be loaded via CDN)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Setup Complete! ✓                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start dev server:  npm run dev" -ForegroundColor White
Write-Host "  2. Open browser:      http://localhost:5173" -ForegroundColor White
Write-Host "  3. Click:             Professional Plan → Subscribe" -ForegroundColor White
Write-Host "  4. Test card:         4242 4242 4242 4242" -ForegroundColor White
Write-Host "  5. Expiry:            12/25" -ForegroundColor White
Write-Host "  6. CVC:               123" -ForegroundColor White
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  • STRIPE_INTEGRATION_COMPLETE.md  - Full guide" -ForegroundColor Gray
Write-Host "  • STRIPE_ACTIVATION_CHECKLIST.md  - Production steps" -ForegroundColor Gray
Write-Host "  • .env.local.example              - All config options" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  Important:" -ForegroundColor Yellow
Write-Host "  • Keep .env.local SECRET - never commit to git" -ForegroundColor Gray
Write-Host "  • Use test keys (pk_test_, sk_test_) for development" -ForegroundColor Gray
Write-Host "  • Test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (decline)" -ForegroundColor Gray
Write-Host ""
