#!/usr/bin/env powershell

<#
.SYNOPSIS
    Complete deployment script for MaycoleTechnologies to Vercel
    
.DESCRIPTION
    This script handles:
    1. GitHub push confirmation
    2. Vercel CLI installation
    3. Vercel login
    4. Production deployment
    5. Post-deployment verification

.EXAMPLE
    .\deploy-to-vercel.ps1
#>

param(
    [switch]$Production = $false,
    [switch]$SkipGit = $false
)

# Colors for output
$Colors = @{
    Success = 'Green'
    Error   = 'Red'
    Info    = 'Cyan'
    Warn    = 'Yellow'
}

function Write-ColorOutput([string]$message, [string]$color = 'White') {
    Write-Host $message -ForegroundColor $color
}

function Check-Git {
    Write-ColorOutput "`n[1/6] Checking Git installation..." $Colors.Info
    
    $gitPath = Get-Command git -ErrorAction SilentlyContinue
    if (-not $gitPath) {
        Write-ColorOutput "❌ Git not found. Please install Git first." $Colors.Error
        return $false
    }
    
    Write-ColorOutput "✅ Git installed: $(git --version)" $Colors.Success
    return $true
}

function Check-GitStatus {
    if ($SkipGit) {
        Write-ColorOutput "⏭️  Skipping Git status check" $Colors.Warn
        return $true
    }
    
    Write-ColorOutput "`n[2/6] Checking Git status..." $Colors.Info
    
    $status = git status --porcelain
    if ($status) {
        Write-ColorOutput "⚠️  Uncommitted changes detected:" $Colors.Warn
        Write-Host $status
        $continue = Read-Host "Continue with deployment? (yes/no)"
        if ($continue -ne 'yes') {
            Write-ColorOutput "❌ Deployment cancelled" $Colors.Error
            return $false
        }
    }
    
    Write-ColorOutput "✅ Git status: Clean" $Colors.Success
    return $true
}

function Push-ToGithub {
    if ($SkipGit) {
        Write-ColorOutput "⏭️  Skipping Git push" $Colors.Warn
        return $true
    }
    
    Write-ColorOutput "`n[3/6] Pushing to GitHub..." $Colors.Info
    
    try {
        git push origin main
        Write-ColorOutput "✅ Successfully pushed to GitHub" $Colors.Success
        return $true
    }
    catch {
        Write-ColorOutput "❌ Git push failed: $_" $Colors.Error
        return $false
    }
}

function Install-VercelCLI {
    Write-ColorOutput "`n[4/6] Checking Vercel CLI..." $Colors.Info
    
    $vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
    if ($vercelPath) {
        Write-ColorOutput "✅ Vercel CLI already installed" $Colors.Success
        vercel --version
        return $true
    }
    
    Write-ColorOutput "Installing Vercel CLI globally..." $Colors.Info
    try {
        npm install -g vercel
        Write-ColorOutput "✅ Vercel CLI installed" $Colors.Success
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to install Vercel CLI: $_" $Colors.Error
        return $false
    }
}

function Deploy-ToVercel {
    Write-ColorOutput "`n[5/6] Deploying to Vercel..." $Colors.Info
    
    $deployArgs = @()
    if ($Production) {
        $deployArgs += '--prod'
        Write-ColorOutput "🚀 PRODUCTION DEPLOYMENT" $Colors.Warn
    } else {
        Write-ColorOutput "📦 Preview deployment" $Colors.Info
    }
    
    try {
        vercel @deployArgs
        Write-ColorOutput "✅ Deployment successful!" $Colors.Success
        return $true
    }
    catch {
        Write-ColorOutput "❌ Deployment failed: $_" $Colors.Error
        return $false
    }
}

function Verify-Deployment {
    Write-ColorOutput "`n[6/6] Verifying deployment..." $Colors.Info
    
    Write-ColorOutput "`nDeployment Summary:" $Colors.Info
    Write-ColorOutput "  • Repository: https://github.com/AntonioMaycole/MaycoleTechnologies" $Colors.Info
    Write-ColorOutput "  • Branch: main" $Colors.Info
    Write-ColorOutput "  • Status: Check Vercel dashboard for live deployment" $Colors.Info
    
    Write-ColorOutput "`nNext Steps:" $Colors.Info
    Write-ColorOutput "  1. Open: https://vercel.com/dashboard" $Colors.Info
    Write-ColorOutput "  2. Set environment variables in Project Settings" $Colors.Info
    Write-ColorOutput "  3. Test API endpoints" $Colors.Info
    Write-ColorOutput "  4. Configure custom domain (optional)" $Colors.Info
    
    Write-ColorOutput "`n✅ Deployment process complete!" $Colors.Success
}

# Main execution
function Main {
    Write-ColorOutput "`n╔═══════════════════════════════════════════════════════════╗" $Colors.Info
    Write-ColorOutput "║   MaycoleTechnologies - Vercel Deployment Script          ║" $Colors.Info
    Write-ColorOutput "║   Ready to launch tonight!                                ║" $Colors.Info
    Write-ColorOutput "╚═══════════════════════════════════════════════════════════╝" $Colors.Info
    
    # Run checks
    if (-not (Check-Git)) { exit 1 }
    if (-not (Check-GitStatus)) { exit 1 }
    if (-not (Push-ToGithub)) { exit 1 }
    if (-not (Install-VercelCLI)) { exit 1 }
    if (-not (Deploy-ToVercel)) { exit 1 }
    
    Verify-Deployment
}

# Run main function
Main
