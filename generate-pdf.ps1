# PDF Generator for OBD-Waste Solutions Pitch Deck
# Uses Chrome/Edge headless mode to generate PDF

$htmlPath = Join-Path $PSScriptRoot "index.html"
$pdfPath = Join-Path $PSScriptRoot "OBD-Waste-Solutions-Pitch-Deck.pdf"

# Try to find Chrome
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe"
)

# Try to find Edge
$edgePaths = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
)

$browser = $null
$browserPath = $null

# Find available browser
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $browserPath = $path
        $browser = "chrome"
        break
    }
}

if (-not $browserPath) {
    foreach ($path in $edgePaths) {
        if (Test-Path $path) {
            $browserPath = $path
            $browser = "edge"
            break
        }
    }
}

if (-not $browserPath) {
    Write-Host "❌ Chrome or Edge not found. Please install Chrome or Edge browser." -ForegroundColor Red
    Write-Host "Alternatively, use the browser's Print to PDF feature:" -ForegroundColor Yellow
    Write-Host "1. Open index.html in your browser" -ForegroundColor Yellow
    Write-Host "2. Press Ctrl+P" -ForegroundColor Yellow
    Write-Host "3. Select 'Save as PDF'" -ForegroundColor Yellow
    Write-Host "4. Set custom size: 1280px x 720px, margins: none" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found $browser at: $browserPath" -ForegroundColor Green
Write-Host "Generating PDF..." -ForegroundColor Yellow

# Convert to file:// URL
$fileUrl = "file:///$($htmlPath.Replace('\', '/').Replace(' ', '%20'))"

# Generate PDF using headless browser
$arguments = @(
    "--headless",
    "--disable-gpu",
    "--print-to-pdf=`"$pdfPath`"",
    "--print-to-pdf-no-header",
    "--no-pdf-header-footer",
    $fileUrl
)

try {
    Start-Process -FilePath $browserPath -ArgumentList $arguments -Wait -NoNewWindow
    
    if (Test-Path $pdfPath) {
        $fileSize = (Get-Item $pdfPath).Length / 1MB
        Write-Host "✅ PDF generated successfully!" -ForegroundColor Green
        Write-Host "Location: $pdfPath" -ForegroundColor Green
        Write-Host "Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "❌ PDF generation failed. File not created." -ForegroundColor Red
        Write-Host "Try using the browser's Print to PDF feature instead." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Try using the browser's Print to PDF feature instead." -ForegroundColor Yellow
}

