# PowerShell script to fix npm ci issues in Dockerfiles
# Replace all npm ci commands with npm install

$dockerfiles = @(
    "backend/auth-service/Dockerfile",
    "backend/ai-service/Dockerfile", 
    "backend/api-gateway/Dockerfile",
    "backend/workflow-service/Dockerfile",
    "backend/analytics-service/Dockerfile",
    "backend/integration-service/Dockerfile",
    "backend/notification-service/Dockerfile",
    "frontend/Dockerfile"
)

foreach ($file in $dockerfiles) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..."
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Replace npm ci with npm install
        $content = $content -replace 'npm ci', 'npm install'
        
        # Write back to file
        Set-Content $file $content -NoNewline
        
        Write-Host "Fixed $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "All Dockerfiles have been updated to use npm install instead of npm ci" 