# Smart Hospital ERP - Stop All Backend Services
# This script stops all running service jobs

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Stopping All Services..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get all background jobs
$jobs = Get-Job

if ($jobs.Count -eq 0) {
    Write-Host "No running jobs found." -ForegroundColor Yellow
} else {
    Write-Host "Stopping $($jobs.Count) jobs..." -ForegroundColor Yellow
    Stop-Job *
    Remove-Job *
    Write-Host "All services stopped." -ForegroundColor Green
}

Write-Host ""
