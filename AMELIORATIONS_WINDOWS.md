# 🚀 Améliorations Spécifiques Windows - LogoDouman

## 🎯 **Améliorations Proposées**

### **1. Scripts d'Installation Améliorés**

#### **A. Script PowerShell Avancé**
```powershell
# setup-windows-advanced.ps1
param(
    [switch]$SkipWSL,
    [switch]$SkipDocker,
    [switch]$Force,
    [string]$DockerMemory = "4096",
    [string]$DockerCPU = "2"
)

# Fonction de logging
function Write-Log {
    param($Message, $Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

# Fonction de vérification des prérequis
function Test-Prerequisites {
    Write-Log "🔍 Vérification des prérequis..." "INFO"
    
    # Vérifier Windows version
    $osVersion = [System.Environment]::OSVersion.Version
    if ($osVersion.Major -lt 10 -or ($osVersion.Major -eq 10 -and $osVersion.Build -lt 19041)) {
        Write-Log "❌ Windows 10 version 2004+ requis" "ERROR"
        return $false
    }
    
    # Vérifier les privilèges
    if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Log "❌ Privilèges administrateur requis" "ERROR"
        return $false
    }
    
    Write-Log "✅ Prérequis validés" "SUCCESS"
    return $true
}

# Fonction d'installation WSL2 optimisée
function Install-WSL2Optimized {
    if ($SkipWSL) {
        Write-Log "⏭️ Installation WSL2 ignorée" "WARNING"
        return
    }
    
    Write-Log "🐧 Installation WSL2 optimisée..." "INFO"
    
    # Activer les fonctionnalités
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
    
    # Installer WSL2
    wsl --install --no-launch
    wsl --set-default-version 2
    
    # Optimiser WSL2
    $wslConfig = @"
[wsl2]
memory=4GB
processors=2
swap=2GB
localhostForwarding=true
"@
    
    $wslConfigPath = "$env:USERPROFILE\.wslconfig"
    $wslConfig | Out-File -FilePath $wslConfigPath -Encoding UTF8
    
    Write-Log "✅ WSL2 installé et optimisé" "SUCCESS"
}

# Fonction d'installation Docker Desktop optimisée
function Install-DockerDesktopOptimized {
    if ($SkipDocker) {
        Write-Log "⏭️ Installation Docker ignorée" "WARNING"
        return
    }
    
    Write-Log "🐳 Installation Docker Desktop optimisée..." "INFO"
    
    # Configuration Docker Desktop
    $dockerSettings = @{
        "wslEngineEnabled" = $true
        "useWsl2" = $true
        "wslDistro" = "Ubuntu"
        "experimental" = $true
        "buildKit" = $true
        "resources" = @{
            "memory" = [int]$DockerMemory
            "cpu" = [int]$DockerCPU
            "disk" = 64
        }
        "wslIntegrationEnabled" = $true
        "wslIntegrationDistros" = @("Ubuntu")
        "kubernetes" = @{
            "enabled" = $false
        }
    }
    
    $dockerSettingsPath = "$env:USERPROFILE\AppData\Roaming\Docker\settings.json"
    $dockerSettingsDir = Split-Path $dockerSettingsPath -Parent
    
    if (!(Test-Path $dockerSettingsDir)) {
        New-Item -ItemType Directory -Path $dockerSettingsDir -Force | Out-Null
    }
    
    $dockerSettings | ConvertTo-Json -Depth 10 | Out-File -FilePath $dockerSettingsPath -Encoding UTF8
    
    Write-Log "✅ Docker Desktop configuré" "SUCCESS"
}

# Script principal
if (Test-Prerequisites) {
    Install-WSL2Optimized
    Install-DockerDesktopOptimized
    
    Write-Log "🎉 Installation terminée !" "SUCCESS"
    Write-Log "⚠️ Redémarrage requis pour finaliser" "WARNING"
}
```

#### **B. Script de Diagnostic Avancé**
```powershell
# diagnostic-windows-advanced.ps1
function Get-SystemInfo {
    Write-Host "🖥️ Informations Système" -ForegroundColor Cyan
    Write-Host "OS: $([System.Environment]::OSVersion.VersionString)"
    Write-Host "Architecture: $([System.Environment]::Is64BitOperatingSystem)"
    Write-Host "RAM: $([math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)) GB"
}

function Test-WSL2Status {
    Write-Host "🐧 Statut WSL2" -ForegroundColor Cyan
    try {
        $wslList = wsl --list --verbose
        Write-Host $wslList
    } catch {
        Write-Host "❌ WSL2 non disponible" -ForegroundColor Red
    }
}

function Test-DockerStatus {
    Write-Host "🐳 Statut Docker" -ForegroundColor Cyan
    try {
        $dockerVersion = docker --version
        Write-Host "Version: $dockerVersion" -ForegroundColor Green
        
        $dockerInfo = docker info --format "{{.ServerVersion}}"
        Write-Host "Server: $dockerInfo" -ForegroundColor Green
        
        $dockerPs = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        Write-Host $dockerPs
    } catch {
        Write-Host "❌ Docker non disponible" -ForegroundColor Red
    }
}

function Test-NetworkConnectivity {
    Write-Host "🌐 Test de Connectivité" -ForegroundColor Cyan
    
    $urls = @(
        "http://localhost:3000",
        "http://localhost:4002/health",
        "http://localhost:8080"
    )
    
    foreach ($url in $urls) {
        try {
            $response = Invoke-WebRequest -Uri $url -TimeoutSec 5
            Write-Host "✅ $url - Status: $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "❌ $url - Erreur: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Get-DockerResources {
    Write-Host "📊 Ressources Docker" -ForegroundColor Cyan
    try {
        $dockerStats = docker system df
        Write-Host $dockerStats
    } catch {
        Write-Host "❌ Impossible de récupérer les statistiques Docker" -ForegroundColor Red
    }
}

# Exécution du diagnostic
Get-SystemInfo
Test-WSL2Status
Test-DockerStatus
Test-NetworkConnectivity
Get-DockerResources
```

### **2. Configuration Docker Optimisée**

#### **A. Docker Compose Windows**
```yaml
# docker-compose.windows.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: logodouman-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: logodouman
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: logodouman123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "55432:5432"
    networks:
      - logodouman-network
    # Optimisations Windows
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  redis:
    image: redis:7-alpine
    container_name: logodouman-redis
    restart: unless-stopped
    command: redis-server --requirepass redis123 --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - logodouman-network
    # Optimisations Windows
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    container_name: logodouman-backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://postgres:logodouman123@postgres:5432/logodouman
      - REDIS_URL=redis://:redis123@redis:6379
      - NODE_ENV=production
      - PORT=4002
    ports:
      - "4002:4002"
    volumes:
      - backend_uploads:/app/uploads
      - backend_logs:/app/logs
    depends_on:
      - postgres
      - redis
    networks:
      - logodouman-network
    # Optimisations Windows
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    container_name: logodouman-frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - NEXT_PUBLIC_API_URL=http://localhost:4002
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - logodouman-network
    # Optimisations Windows
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  backend_uploads:
    driver: local
  backend_logs:
    driver: local

networks:
  logodouman-network:
    driver: bridge
    # Optimisations Windows
    driver_opts:
      com.docker.network.bridge.name: "logodouman-bridge"
```

#### **B. Dockerfile Backend Optimisé Windows**
```dockerfile
# backend/Dockerfile.windows
FROM node:18-alpine

# Optimisations Windows
ENV NODE_ENV=production
ENV DOCKER_BUILDKIT=1
ENV COMPOSE_DOCKER_CLI_BUILD=1

# Installer les dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances avec cache optimisé
RUN npm ci --only=production --no-audit --no-fund

# Copier le code source
COPY . .

# Créer les répertoires nécessaires
RUN mkdir -p /app/uploads /app/logs

# Optimisations Windows
RUN chmod +x scripts/docker-entrypoint.sh

# Exposer le port
EXPOSE 4002

# Healthcheck optimisé
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4002/health || exit 1

# Commande de démarrage
CMD ["node", "src/app.js"]
```

### **3. Scripts de Maintenance**

#### **A. Script de Nettoyage Automatique**
```powershell
# cleanup-windows.ps1
param(
    [switch]$Full,
    [switch]$KeepVolumes,
    [switch]$KeepImages
)

Write-Host "🧹 Nettoyage LogoDouman Windows" -ForegroundColor Cyan

# Arrêter les services
Write-Host "🛑 Arrêt des services..." -ForegroundColor Yellow
docker-compose down

if ($Full) {
    # Nettoyage complet
    Write-Host "🗑️ Nettoyage complet..." -ForegroundColor Yellow
    
    if (!$KeepVolumes) {
        docker volume prune -f
        Write-Host "✅ Volumes supprimés" -ForegroundColor Green
    }
    
    if (!$KeepImages) {
        docker image prune -a -f
        Write-Host "✅ Images supprimées" -ForegroundColor Green
    }
    
    docker system prune -a -f
    Write-Host "✅ Système nettoyé" -ForegroundColor Green
} else {
    # Nettoyage léger
    Write-Host "🧽 Nettoyage léger..." -ForegroundColor Yellow
    docker system prune -f
    Write-Host "✅ Nettoyage léger terminé" -ForegroundColor Green
}

# Redémarrer les services
Write-Host "🚀 Redémarrage des services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "✅ Nettoyage terminé !" -ForegroundColor Green
```

#### **B. Script de Monitoring**
```powershell
# monitor-windows.ps1
param(
    [int]$Interval = 30,
    [switch]$Continuous
)

function Get-DockerStats {
    $stats = docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    return $stats
}

function Get-ServiceHealth {
    $services = @("frontend", "backend", "postgres", "redis")
    $health = @{}
    
    foreach ($service in $services) {
        try {
            $status = docker-compose ps $service --format "{{.State}}"
            $health[$service] = $status
        } catch {
            $health[$service] = "ERROR"
        }
    }
    
    return $health
}

function Show-Dashboard {
    Clear-Host
    Write-Host "📊 Dashboard LogoDouman Windows" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    
    # Informations système
    $memory = Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty TotalPhysicalMemory
    $memoryGB = [math]::Round($memory / 1GB, 2)
    Write-Host "🖥️ RAM Disponible: $memoryGB GB" -ForegroundColor White
    
    # Statut des services
    Write-Host "`n🔧 Statut des Services:" -ForegroundColor Yellow
    $health = Get-ServiceHealth
    foreach ($service in $health.Keys) {
        $status = $health[$service]
        $color = switch($status) {
            "running" { "Green" }
            "ERROR" { "Red" }
            default { "Yellow" }
        }
        Write-Host "  $service`: $status" -ForegroundColor $color
    }
    
    # Statistiques Docker
    Write-Host "`n🐳 Statistiques Docker:" -ForegroundColor Yellow
    $stats = Get-DockerStats
    Write-Host $stats
    
    # URLs d'accès
    Write-Host "`n🌐 URLs d'Accès:" -ForegroundColor Yellow
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend: http://localhost:4002" -ForegroundColor White
    Write-Host "  Adminer: http://localhost:8080" -ForegroundColor White
}

# Boucle de monitoring
if ($Continuous) {
    Write-Host "🔄 Monitoring continu (Ctrl+C pour arrêter)" -ForegroundColor Cyan
    while ($true) {
        Show-Dashboard
        Start-Sleep -Seconds $Interval
    }
} else {
    Show-Dashboard
}
```

### **4. Configuration Environnement Windows**

#### **A. Variables d'Environnement Windows**
```env
# .env.windows
COMPOSE_CONVERT_WINDOWS_PATHS=1
COMPOSE_FORCE_WINDOWS_HOST=1
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1

# Optimisations Windows
NODE_OPTIONS=--max-old-space-size=4096
DOCKER_MEMORY_LIMIT=4G
DOCKER_CPU_LIMIT=2
```

#### **B. Configuration PowerShell**
```powershell
# profile-windows.ps1
# Ajouter au profil PowerShell : $PROFILE

# Alias utiles
Set-Alias -Name dc -Value docker-compose
Set-Alias -Name dcu -Value "docker-compose up -d"
Set-Alias -Name dcd -Value "docker-compose down"
Set-Alias -Name dcb -Value "docker-compose build --no-cache"

# Fonctions utiles
function Start-LogoDouman {
    Write-Host "🚀 Démarrage LogoDouman..." -ForegroundColor Cyan
    docker-compose up -d
    Write-Host "✅ LogoDouman démarré !" -ForegroundColor Green
}

function Stop-LogoDouman {
    Write-Host "🛑 Arrêt LogoDouman..." -ForegroundColor Cyan
    docker-compose down
    Write-Host "✅ LogoDouman arrêté !" -ForegroundColor Green
}

function Restart-LogoDouman {
    Write-Host "🔄 Redémarrage LogoDouman..." -ForegroundColor Cyan
    docker-compose restart
    Write-Host "✅ LogoDouman redémarré !" -ForegroundColor Green
}

function Show-LogoDoumanLogs {
    param([string]$Service = "")
    if ($Service) {
        docker-compose logs -f $Service
    } else {
        docker-compose logs -f
    } else {
        docker-compose logs -f
    }
}

# Export des fonctions
Export-ModuleMember -Function Start-LogoDouman, Stop-LogoDouman, Restart-LogoDouman, Show-LogoDoumanLogs
```

### **5. Scripts de Déploiement**

#### **A. Script de Déploiement Production**
```powershell
# deploy-production-windows.ps1
param(
    [string]$Environment = "production",
    [switch]$Backup,
    [switch]$Migrate
)

Write-Host "🚀 Déploiement Production LogoDouman Windows" -ForegroundColor Cyan

# Sauvegarde si demandée
if ($Backup) {
    Write-Host "💾 Sauvegarde des données..." -ForegroundColor Yellow
    $backupDate = Get-Date -Format "yyyyMMdd_HHmmss"
    docker-compose exec postgres pg_dump -U postgres logodouman > "backup_$backupDate.sql"
    Write-Host "✅ Sauvegarde créée: backup_$backupDate.sql" -ForegroundColor Green
}

# Arrêter les services
Write-Host "🛑 Arrêt des services..." -ForegroundColor Yellow
docker-compose down

# Reconstruire les images
Write-Host "🏗️ Reconstruction des images..." -ForegroundColor Yellow
docker-compose build --no-cache

# Démarrer les services
Write-Host "🚀 Démarrage des services..." -ForegroundColor Yellow
docker-compose up -d

# Migration si demandée
if ($Migrate) {
    Write-Host "🔄 Exécution des migrations..." -ForegroundColor Yellow
    docker-compose exec backend node scripts/migrate.js
    Write-Host "✅ Migrations exécutées" -ForegroundColor Green
}

# Vérification
Write-Host "🔍 Vérification du déploiement..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
docker-compose ps

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
```

## 🎯 **Résumé des Améliorations**

### **✅ Scripts Avancés**
- Installation automatisée avec paramètres
- Diagnostic complet du système
- Monitoring en temps réel
- Nettoyage intelligent

### **✅ Configuration Optimisée**
- Docker Compose optimisé pour Windows
- Variables d'environnement spécifiques
- Profil PowerShell personnalisé
- Scripts de maintenance

### **✅ Déploiement Production**
- Sauvegarde automatique
- Migration des données
- Vérification de santé
- Monitoring continu

---

**🎉 Ces améliorations rendent LogoDouman parfaitement adapté à Windows !**
