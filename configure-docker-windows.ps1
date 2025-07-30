# 🐳 Configuration automatique Docker Desktop Windows
# Exécuter en tant qu'administrateur

Write-Host "🐳 ======================================" -ForegroundColor Cyan
Write-Host "⚙️ Configuration Docker Desktop Windows" -ForegroundColor Cyan
Write-Host "🐳 ======================================" -ForegroundColor Cyan

# 🔍 Vérifier les privilèges administrateur
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Ce script doit être exécuté en tant qu'administrateur" -ForegroundColor Red
    Write-Host "💡 Clic droit sur PowerShell → 'Exécuter en tant qu'administrateur'" -ForegroundColor Yellow
    exit 1
}

# 🔧 Fonction pour configurer Docker Desktop
function Configure-DockerDesktop {
    Write-Host "🔧 Configuration de Docker Desktop..." -ForegroundColor Blue
    
    # Chemin du fichier de configuration Docker Desktop
    $dockerSettingsPath = "$env:USERPROFILE\AppData\Roaming\Docker\settings.json"
    $dockerSettingsDir = Split-Path $dockerSettingsPath -Parent
    
    # Créer le dossier si nécessaire
    if (!(Test-Path $dockerSettingsDir)) {
        New-Item -ItemType Directory -Path $dockerSettingsDir -Force | Out-Null
        Write-Host "   📁 Dossier de configuration créé" -ForegroundColor Gray
    }
    
    # Configuration Docker Desktop avec WSL2
    $dockerSettings = @{
        "wslEngineEnabled" = $true
        "useWsl2" = $true
        "wslDistro" = "Ubuntu"
        "experimental" = $true
        "buildKit" = $true
        "resources" = @{
            "memory" = 4096
            "cpu" = 2
            "disk" = 64
        }
        "wslIntegrationEnabled" = $true
        "wslIntegrationDistros" = @("Ubuntu")
    } | ConvertTo-Json -Depth 10
    
    # Sauvegarder la configuration
    $dockerSettings | Out-File -FilePath $dockerSettingsPath -Encoding UTF8
    Write-Host "✅ Configuration Docker Desktop appliquée" -ForegroundColor Green
    
    # Afficher la configuration
    Write-Host "📋 Configuration appliquée :" -ForegroundColor Cyan
    Write-Host "   - WSL2 Engine: Activé" -ForegroundColor White
    Write-Host "   - WSL Integration: Activée" -ForegroundColor White
    Write-Host "   - BuildKit: Activé" -ForegroundColor White
    Write-Host "   - Memory: 4GB" -ForegroundColor White
    Write-Host "   - CPU: 2 cores" -ForegroundColor White
}

# 🔧 Fonction pour redémarrer Docker Desktop
function Restart-DockerDesktop {
    Write-Host "🔄 Redémarrage de Docker Desktop..." -ForegroundColor Blue
    
    # Arrêter Docker Desktop
    Write-Host "   🛑 Arrêt de Docker Desktop..." -ForegroundColor Gray
    Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    
    # Démarrer Docker Desktop
    Write-Host "   🚀 Démarrage de Docker Desktop..." -ForegroundColor Gray
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    # Attendre que Docker soit prêt
    Write-Host "   ⏳ Attente du démarrage..." -ForegroundColor Gray
    $timeout = 60
    $elapsed = 0
    
    while ($elapsed -lt $timeout) {
        try {
            docker version | Out-Null
            Write-Host "✅ Docker Desktop démarré avec succès" -ForegroundColor Green
            break
        }
        catch {
            Start-Sleep -Seconds 2
            $elapsed += 2
            Write-Host "   ⏳ Attente... ($elapsed/$timeout secondes)" -ForegroundColor Gray
        }
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "⚠️  Docker Desktop prend du temps à démarrer" -ForegroundColor Yellow
        Write-Host "💡 Vérifiez manuellement Docker Desktop" -ForegroundColor Yellow
    }
}

# 🔧 Fonction pour vérifier WSL2
function Test-WSL2 {
    Write-Host "🔍 Vérification WSL2..." -ForegroundColor Blue
    
    try {
        $wslOutput = wsl --list --verbose
        Write-Host "✅ WSL2 est installé et configuré" -ForegroundColor Green
        Write-Host "📋 Distributions WSL :" -ForegroundColor Cyan
        $wslOutput | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
    }
    catch {
        Write-Host "❌ WSL2 n'est pas installé" -ForegroundColor Red
        Write-Host "🔧 Installation de WSL2..." -ForegroundColor Blue
        
        # Installer WSL2
        dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
        dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
        wsl --install --no-launch
        wsl --set-default-version 2
        
        Write-Host "✅ WSL2 installé" -ForegroundColor Green
        Write-Host "⚠️  Redémarrage requis pour finaliser l'installation" -ForegroundColor Yellow
    }
}

# 🔧 Fonction pour tester Docker
function Test-Docker {
    Write-Host "🔍 Test de Docker..." -ForegroundColor Blue
    
    try {
        $dockerVersion = docker --version
        Write-Host "✅ Docker fonctionne: $dockerVersion" -ForegroundColor Green
        
        # Test simple
        docker ps | Out-Null
        Write-Host "✅ Docker Desktop est opérationnel" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "❌ Docker ne fonctionne pas" -ForegroundColor Red
        return $false
    }
}

# 🎯 Script principal
Write-Host "🚀 Configuration automatique Docker Desktop..." -ForegroundColor Green

# 1. Vérifier WSL2
Test-WSL2

# 2. Configurer Docker Desktop
Configure-DockerDesktop

# 3. Redémarrer Docker Desktop
Restart-DockerDesktop

# 4. Tester Docker
if (Test-Docker) {
    Write-Host "🎉 Configuration terminée avec succès !" -ForegroundColor Green
    Write-Host "🌐 Tu peux maintenant lancer LogoDouman :" -ForegroundColor Cyan
    Write-Host "   docker-compose build --no-cache" -ForegroundColor White
    Write-Host "   docker-compose up -d" -ForegroundColor White
} else {
    Write-Host "⚠️  Problème avec Docker Desktop" -ForegroundColor Yellow
    Write-Host "💡 Vérifiez manuellement Docker Desktop" -ForegroundColor Yellow
}

Write-Host "🐳 ======================================" -ForegroundColor Cyan
Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host "🐳 ======================================" -ForegroundColor Cyan 