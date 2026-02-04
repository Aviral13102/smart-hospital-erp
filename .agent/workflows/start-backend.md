---
description: Start all 6 backend microservices simultaneously using PowerShell jobs
---

# Start All Backend Services

This workflow starts all Smart Hospital ERP backend microservices in parallel using PowerShell background jobs.

## Quick Start

// turbo
1. Run the start script:
```powershell
cd c:\CODES\AG\backend
.\start-all.ps1
```

## Service Ports

| Service | Port | Health Check |
|---------|------|--------------|
| Auth Service | 8081 | http://localhost:8081/actuator/health |
| OPD Service | 8082 | http://localhost:8082/actuator/health |
| IPD Service | 8083 | http://localhost:8083/actuator/health |
| Transport Service | 8084 | http://localhost:8084/actuator/health |
| Staff Service | 8085 | http://localhost:8085/actuator/health |
| Lab Service | 8086 | http://localhost:8086/actuator/health |

## Managing Jobs

```powershell
# List running jobs
Get-Job

# View output of a specific job
Receive-Job -Name "Auth Service"

# View output of all jobs
Get-Job | Receive-Job

# Stop all services
.\stop-all.ps1
# Or manually:
Stop-Job *; Remove-Job *
```

## Prerequisites

- Java 17+ installed
- Maven installed and in PATH
- PostgreSQL running on localhost:5432
- Database `hospital_erp` created
