# 🚀 Script d'installation automatique Windows pour LogoDouman
# Exécuter en tant qu'administrateur

Write-Host "🐳 ======================================" -ForegroundColor Cyan
Write-Host "🚀 Installation automatique LogoDouman" -ForegroundColor Cyan
Write-Host "🐳 ======================================" -ForegroundColor Cyan

# 🔍 Vérifier si on est administrateur
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Ce script doit être exécuté en tant qu'administrateur" -ForegroundColor Red
    Write-Host "💡 Clic droit sur PowerShell → 'Exécuter en tant qu'administrateur'" -ForegroundColor Yellow
    exit 1
}

# 🔧 Fonction pour vérifier si une commande existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# 🔧 Fonction pour installer WSL2
function Install-WSL2 {
    Write-Host "🔧 Installation de WSL2..." -ForegroundColor Blue
    
    # Activer les fonctionnalités Windows
    Write-Host "   📦 Activation des fonctionnalités Windows..." -ForegroundColor Gray
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
    
    # Télécharger et installer le kernel WSL2
    Write-Host "   📥 Téléchargement du kernel WSL2..." -ForegroundColor Gray
    $kernelUrl = "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi"
    $kernelPath = "$env:TEMP\wsl_update_x64.msi"
    Invoke-WebRequest -Uri $kernelUrl -OutFile $kernelPath
    Start-Process -FilePath $kernelPath -ArgumentList "/quiet" -Wait
    
    # Installer WSL2
    Write-Host "   🐧 Installation de WSL2..." -ForegroundColor Gray
    wsl --install --no-launch
    
    # Définir WSL2 comme version par défaut
    Write-Host "   ⚙️ Configuration de WSL2..." -ForegroundColor Gray
    wsl --set-default-version 2
    
    Write-Host "✅ WSL2 installé avec succès" -ForegroundColor Green
    Write-Host "⚠️  Redémarrage requis pour finaliser l'installation" -ForegroundColor Yellow
}

# 🔧 Fonction pour vérifier Docker
function Test-Docker {
    Write-Host "🔍 Vérification de Docker..." -ForegroundColor Blue
    
    if (Test-Command "docker") {
        $dockerVersion = docker --version
        Write-Host "✅ Docker trouvé: $dockerVersion" -ForegroundColor Green
        
        # Vérifier si Docker Desktop fonctionne
        try {
            docker ps | Out-Null
            Write-Host "✅ Docker Desktop fonctionne" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ Docker Desktop ne fonctionne pas" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "❌ Docker n'est pas installé" -ForegroundColor Red
        return $false
    }
}

# 🔧 Fonction pour installer Docker Desktop
function Install-DockerDesktop {
    Write-Host "🐳 Installation de Docker Desktop..." -ForegroundColor Blue
    
    # URL de téléchargement Docker Desktop
    $dockerUrl = "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe"
    $dockerPath = "$env:TEMP\DockerDesktopInstaller.exe"
    
    Write-Host "   📥 Téléchargement de Docker Desktop..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $dockerUrl -OutFile $dockerPath
    
    Write-Host "   🔧 Installation de Docker Desktop..." -ForegroundColor Gray
    Write-Host "   ⚠️  L'installation va s'ouvrir dans une nouvelle fenêtre" -ForegroundColor Yellow
    Start-Process -FilePath $dockerPath -ArgumentList "install --quiet" -Wait
    
    Write-Host "✅ Docker Desktop installé" -ForegroundColor Green
    Write-Host "⚠️  Redémarrage requis pour finaliser l'installation" -ForegroundColor Yellow
}

# 🔧 Fonction pour configurer Docker Desktop
function Configure-DockerDesktop {
    Write-Host "⚙️ Configuration de Docker Desktop..." -ForegroundColor Blue
    
    # Créer le fichier de configuration Docker Desktop
    $dockerSettingsPath = "$env:USERPROFILE\AppData\Roaming\Docker\settings.json"
    $dockerSettingsDir = Split-Path $dockerSettingsPath -Parent
    
    if (!(Test-Path $dockerSettingsDir)) {
        New-Item -ItemType Directory -Path $dockerSettingsDir -Force | Out-Null
    }
    
    $dockerSettings = @{
        "wslEngineEnabled" = $true
        "useWsl2" = $true
        "wslDistro" = "Ubuntu"
    } | ConvertTo-Json -Depth 10
    
    $dockerSettings | Out-File -FilePath $dockerSettingsPath -Encoding UTF8
    
    Write-Host "✅ Configuration Docker Desktop appliquée" -ForegroundColor Green
}

# 🔧 Fonction pour démarrer le projet
function Start-LogoDouman {
    Write-Host "🚀 Démarrage de LogoDouman..." -ForegroundColor Blue
    
    # Vérifier que Docker fonctionne
    if (!(Test-Docker)) {
        Write-Host "❌ Docker n'est pas disponible" -ForegroundColor Red
        return $false
    }
    
    # Construire et démarrer les services
    Write-Host "   🏗️ Construction des images Docker..." -ForegroundColor Gray
    docker-compose build --no-cache
    
    Write-Host "   🚀 Démarrage des services..." -ForegroundColor Gray
    docker-compose up -d
    
    # Vérifier l'état
    Write-Host "   🔍 Vérification de l'état..." -ForegroundColor Gray
    docker-compose ps
    
    Write-Host "✅ LogoDouman démarré avec succès !" -ForegroundColor Green
    Write-Host "🌐 URLs d'accès :" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend: http://localhost:4002" -ForegroundColor White
    Write-Host "   Adminer: http://localhost:8080" -ForegroundColor White
    Write-Host "   Admin: http://localhost:3000/admin" -ForegroundColor White
    
    return $true
}

# 🎯 Script principal
Write-Host "🔍 Vérification de l'environnement..." -ForegroundColor Blue

# Vérifier WSL2
$wslInstalled = $false
try {
    wsl --list --verbose | Out-Null
    $wslInstalled = $true
    Write-Host "✅ WSL2 est installé" -ForegroundColor Green
} catch {
    Write-Host "❌ WSL2 n'est pas installé" -ForegroundColor Red
}

# Installer WSL2 si nécessaire
if (!$wslInstalled) {
    Write-Host "🔧 Installation de WSL2..." -ForegroundColor Blue
    Install-WSL2
    Write-Host "⚠️  Redémarrez Windows puis relancez ce script" -ForegroundColor Yellow
    exit 0
}

# Vérifier Docker
$dockerWorking = Test-Docker

# Installer Docker si nécessaire
if (!$dockerWorking) {
    Write-Host "🔧 Installation de Docker Desktop..." -ForegroundColor Blue
    Install-DockerDesktop
    Configure-DockerDesktop
    Write-Host "⚠️  Redémarrez Windows puis relancez ce script" -ForegroundColor Yellow
    exit 0
}

# Démarrer le projet
Write-Host "🚀 Tout est prêt, démarrage du projet..." -ForegroundColor Green
Start-LogoDouman

Write-Host "🐳 ======================================" -ForegroundColor Cyan
Write-Host "✅ Installation terminée !" -ForegroundColor Green
Write-Host "🐳 ======================================" -ForegroundColor Cyan 