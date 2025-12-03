$files = Get-ChildItem -Path "c:\Users\TEMP\Downloads\MaycoleTechnologies\src" -Include "*.tsx" -Recurse
$fixedCount = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace @package-name/@version with @package-name
    $content = $content -replace '(@[\w\-]+)/(@[\d.]+)', '$1'
    # Replace @package-name@version with @package-name
    $content = $content -replace '(@[\w\-]+)@([\d.]+)', '$1'
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -NoNewline
        $fixedCount++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Summary: Fixed $fixedCount files" -ForegroundColor Green
