# ⚠️ Problèmes Potentiels Windows - LogoDouman

## 🚨 **Problèmes Courants et Solutions**

### **1. WSL2 et Docker Desktop**

#### **Problème : WSL2 ne démarre pas**
```powershell
# Symptômes
wsl --list --verbose
# Erreur : WSL 2 requires an update to its kernel component

# Solution
wsl --update
wsl --set-default-version 2
wsl --shutdown
wsl --list --verbose
```

#### **Problème : Docker Desktop ne détecte pas WSL2**
```powershell
# Vérifier WSL2
wsl --list --verbose

# Redémarrer Docker Desktop
# Settings → General → Use WSL 2 based engine
```

### **2. Problèmes de Build**

#### **Problème : Build échoue avec erreur de permissions**
```cmd
# Solution
.\fix-windows-build.bat

# Ou manuellement
docker-compose down
docker system prune -a -f
docker-compose build --no-cache
```

#### **Problème : Erreur "no space left on device"**
```cmd
# Nettoyer Docker
docker system prune -a -f
docker volume prune -f

# Vérifier l'espace disque
docker system df
```

### **3. Problèmes de Ports**

#### **Problème : Port déjà utilisé**
```cmd
# Vérifier les ports
netstat -an | findstr :3000
netstat -an | findstr :4002

# Tuer le processus
taskkill /f /im node.exe
taskkill /f /im docker.exe
```

#### **Problème : Port inaccessible**
```cmd
# Vérifier le pare-feu Windows
# Windows Defender → Pare-feu → Autoriser une application
# Ajouter Docker Desktop
```

### **4. Problèmes d'Encodage**

#### **Problème : Caractères spéciaux dans les logs**
```powershell
# Solution PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

#### **Problème : Erreur "Invalid character in header"**
```cmd
# Solution
set COMPOSE_CONVERT_WINDOWS_PATHS=1
set COMPOSE_FORCE_WINDOWS_HOST=1
```

### **5. Problèmes de Performance**

#### **Problème : Docker lent sur Windows**
```json
// Docker Desktop Settings
{
  "resources": {
    "memory": 4096,
    "cpu": 2,
    "disk": 64
  },
  "wslEngineEnabled": true,
  "useWsl2": true
}
```

#### **Problème : Build très lent**
```cmd
# Activer BuildKit
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1
```

### **6. Problèmes d'Antivirus**

#### **Problème : Antivirus bloque Docker**
```
# Solutions :
1. Ajouter Docker aux exclusions
2. Désactiver temporairement l'antivirus
3. Configurer les exclusions :
   - C:\Program Files\Docker
   - C:\Users\[user]\AppData\Roaming\Docker
   - C:\Users\[user]\.docker
```

### **7. Problèmes de Réseau**

#### **Problème : Services ne communiquent pas**
```cmd
# Vérifier le réseau Docker
docker network ls
docker network inspect logodouman_logodouman-network

# Recréer le réseau
docker-compose down
docker network prune
docker-compose up -d
```

#### **Problème : CORS errors**
```javascript
// Vérifier la configuration CORS dans backend/src/app.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://frontend:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
};
```

## 🔧 **Solutions Avancées**

### **1. Script de Diagnostic Complet**
```powershell
# diagnostic-windows.ps1
Write-Host "🔍 Diagnostic LogoDouman Windows" -ForegroundColor Cyan

# Vérifier WSL2
Write-Host "📋 WSL2 Status:" -ForegroundColor Yellow
wsl --list --verbose

# Vérifier Docker
Write-Host "📋 Docker Status:" -ForegroundColor Yellow
docker --version
docker ps

# Vérifier les ports
Write-Host "📋 Ports Status:" -ForegroundColor Yellow
netstat -an | findstr :3000
netstat -an | findstr :4002

# Vérifier l'espace disque
Write-Host "📋 Disk Space:" -ForegroundColor Yellow
docker system df

# Vérifier les services
Write-Host "📋 Services Status:" -ForegroundColor Yellow
docker-compose ps
```

### **2. Script de Reset Complet**
```cmd
@echo off
echo 🧹 Reset Complet LogoDouman Windows

echo 🛑 Arrêt des services...
docker-compose down

echo 🗑️ Nettoyage Docker...
docker system prune -a -f
docker volume prune -f
docker network prune -f

echo 🔄 Redémarrage Docker Desktop...
taskkill /f /im "Docker Desktop.exe"
timeout /t 5
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo ⏳ Attente du démarrage...
timeout /t 30

echo 🏗️ Reconstruction...
docker-compose build --no-cache

echo 🚀 Démarrage...
docker-compose up -d

echo ✅ Reset terminé !
pause
```

### **3. Configuration Optimale Windows**
```json
// Docker Desktop settings.json
{
  "wslEngineEnabled": true,
  "useWsl2": true,
  "wslDistro": "Ubuntu",
  "experimental": true,
  "buildKit": true,
  "resources": {
    "memory": 4096,
    "cpu": 2,
    "disk": 64
  },
  "wslIntegrationEnabled": true,
  "wslIntegrationDistros": ["Ubuntu"],
  "kubernetes": {
    "enabled": false
  }
}
```

## 🚨 **Problèmes Critiques**

### **1. WSL2 Kernel Update Required**
```powershell
# Erreur : WSL 2 requires an update to its kernel component
# Solution :
wsl --update
wsl --shutdown
# Redémarrer Windows
```

### **2. Docker Desktop ne démarre pas**
```cmd
# Vérifier les services Windows
services.msc
# Vérifier : Docker Desktop Service

# Redémarrer les services
net stop com.docker.service
net start com.docker.service
```

### **3. Hyper-V Conflict**
```powershell
# Désactiver Hyper-V si conflit
dism.exe /online /disable-feature:Microsoft-Hyper-V
# Redémarrer Windows
```

## 📊 **Monitoring et Debug**

### **1. Logs Détaillés**
```cmd
# Logs Docker Desktop
Get-EventLog -LogName Application -Source "Docker Desktop"

# Logs WSL2
wsl --list --verbose

# Logs des services
docker-compose logs -f --tail=100
```

### **2. Vérifications Système**
```powershell
# Vérifier les fonctionnalités Windows
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform

# Vérifier Docker
docker version
docker info
```

### **3. Tests de Connectivité**
```cmd
# Test des URLs
curl -s -o nul -w "%{http_code}" http://localhost:3000
curl -s -o nul -w "%{http_code}" http://localhost:4002/health
curl -s -o nul -w "%{http_code}" http://localhost:8080
```

## 🎯 **Checklist de Résolution**

### **Problème de Build**
- [ ] Vérifier WSL2
- [ ] Vérifier Docker Desktop
- [ ] Nettoyer Docker
- [ ] Reconstruire avec --no-cache
- [ ] Vérifier l'espace disque

### **Problème de Ports**
- [ ] Vérifier les ports occupés
- [ ] Tuer les processus
- [ ] Vérifier le pare-feu
- [ ] Modifier les ports si nécessaire

### **Problème de Performance**
- [ ] Augmenter les ressources Docker
- [ ] Activer WSL2
- [ ] Désactiver l'antivirus temporairement
- [ ] Vérifier l'espace disque

### **Problème de Réseau**
- [ ] Vérifier le réseau Docker
- [ ] Recréer le réseau
- [ ] Vérifier la configuration CORS
- [ ] Redémarrer Docker Desktop

---

**💡 En cas de problème persistant, utiliser les scripts de diagnostic et de reset fournis.**
