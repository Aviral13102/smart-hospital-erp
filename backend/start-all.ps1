# Smart Hospital ERP - Start All Backend Services
# This script starts all microservices as background jobs in parallel

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Smart Hospital ERP - Starting Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = $PSScriptRoot
if (-not $backendPath) {
    $backendPath = "c:\CODES\AG\backend"
}

# Use local Maven installation
$mavenPath = Join-Path $backendPath "apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mavenPath)) {
    Write-Host "[!] Maven not found at: $mavenPath" -ForegroundColor Red
    Write-Host "[!] Please run: Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile 'maven.zip'; Expand-Archive -Path 'maven.zip' -DestinationPath '.'" -ForegroundColor Yellow
    exit 1
}

Write-Host "[*] Using Maven: $mavenPath" -ForegroundColor Gray

$services = @(
    @{ Name = "Auth Service";      Port = 8081; Path = "auth-service" },
    @{ Name = "OPD Service";       Port = 8082; Path = "opd-service" },
    @{ Name = "IPD Service";       Port = 8083; Path = "ipd-service" },
    @{ Name = "Transport Service"; Port = 8084; Path = "transport-service" },
    @{ Name = "Staff Service";     Port = 8085; Path = "staff-service" },
    @{ Name = "Lab Service";       Port = 8086; Path = "lab-service" }
)

# Stop any existing jobs
Get-Job | Where-Object { $services.Name -contains $_.Name } | Stop-Job -PassThru | Remove-Job -Force

$jobs = @()

foreach ($service in $services) {
    $servicePath = Join-Path $backendPath $service.Path
    
    if (Test-Path $servicePath) {
        Write-Host "[*] Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Yellow
        
        $job = Start-Job -Name $service.Name -ScriptBlock {
            param($path, $mvn)
            Set-Location $path
            & $mvn spring-boot:run 2>&1
        } -ArgumentList $servicePath, $mavenPath
        
        $jobs += @{
            Job = $job
            Service = $service
        }
    } else {
        Write-Host "[!] Service not found: $servicePath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  All services starting in background!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service Ports:" -ForegroundColor Cyan
foreach ($service in $services) {
    Write-Host "  - $($service.Name): http://localhost:$($service.Port)" -ForegroundColor White
}
Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  Get-Job              # List all jobs" -ForegroundColor Gray
Write-Host "  Receive-Job -Name X  # View output of job X" -ForegroundColor Gray
Write-Host "  Stop-Job *           # Stop all jobs" -ForegroundColor Gray
Write-Host "  Remove-Job *         # Remove all jobs" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop all services: Stop-Job *; Remove-Job *" -ForegroundColor Yellow
Write-Host ""

# Wait for initial startup and show status
Write-Host "Waiting for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 8
Write-Host ""
Write-Host "Job Status:" -ForegroundColor Cyan
Get-Job | Format-Table -Property Id, Name, State -AutoSize
