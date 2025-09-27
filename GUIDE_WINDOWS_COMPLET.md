# 🪟 Guide Complet Windows - LogoDouman

## 🎯 **Installation Automatique (Recommandée)**

### **Méthode 1 : Script PowerShell (Complet)**
```powershell
# 1. Ouvrir PowerShell en tant qu'administrateur
# 2. Exécuter :
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup-windows.ps1
```

### **Méthode 2 : Script Batch (Simple)**
```cmd
# 1. Clic droit sur setup-windows.bat
# 2. "Exécuter en tant qu'administrateur"
```

### **Méthode 3 : Installation Manuelle**
```powershell
# 1. Installer WSL2
wsl --install
wsl --set-default-version 2

# 2. Redémarrer Windows

# 3. Installer Docker Desktop
# Télécharger depuis : https://www.docker.com/products/docker-desktop/

# 4. Configurer Docker Desktop
.\configure-docker-windows.ps1

# 5. Démarrer le projet
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 **Problèmes Courants et Solutions**

### **Problème 1 : WSL2 ne démarre pas**
```powershell
# Solution
wsl --unregister Ubuntu
wsl --install Ubuntu
wsl --set-default-version 2
```

### **Problème 2 : Docker Desktop ne fonctionne pas**
```powershell
# Vérifier WSL2
wsl --list --verbose

# Redémarrer Docker Desktop
# Démarrer → Docker Desktop
```

### **Problème 3 : Ports occupés**
```cmd
# Vérifier les ports
netstat -an | findstr :3000
netstat -an | findstr :4002

# Modifier docker-compose.yml si nécessaire
ports:
  - "3001:3000"  # Au lieu de "3000:3000"
```

### **Problème 4 : Build échoue**
```cmd
# Utiliser le script de fix
.\fix-windows-build.bat
```

### **Problème 5 : Services ne démarrent pas**
```cmd
# Force start
.\force-start-windows.bat
```

## 🛠️ **Configuration Optimale Windows**

### **1. Configuration Docker Desktop**
```json
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
  }
}
```

### **2. Variables d'Environnement Windows**
```env
# .env.windows
COMPOSE_CONVERT_WINDOWS_PATHS=1
COMPOSE_FORCE_WINDOWS_HOST=1
```

### **3. Configuration PowerShell**
```powershell
# Activer l'exécution de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Changer l'encodage pour les caractères spéciaux
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

## 📋 **Checklist d'Installation Windows**

### **Avant l'Installation**
- [ ] Windows 10/11 (version 2004+)
- [ ] Privilèges administrateur
- [ ] Connexion Internet
- [ ] Antivirus configuré (exclusions Docker)

### **Installation**
- [ ] WSL2 installé et configuré
- [ ] Docker Desktop installé
- [ ] Docker Desktop configuré avec WSL2
- [ ] Projet cloné
- [ ] Scripts d'installation exécutés

### **Vérification**
- [ ] `wsl --list --verbose` fonctionne
- [ ] `docker --version` fonctionne
- [ ] `docker ps` fonctionne
- [ ] `docker-compose ps` fonctionne

### **Démarrage**
- [ ] `docker-compose build --no-cache` réussi
- [ ] `docker-compose up -d` réussi
- [ ] Frontend accessible : http://localhost:3000
- [ ] Backend accessible : http://localhost:4002
- [ ] Adminer accessible : http://localhost:8080

## 🚀 **Commandes Windows Spécifiques**

### **Démarrage Rapide**
```cmd
# 1. Installation complète
.\setup-windows.bat

# 2. Si problème de build
.\fix-windows-build.bat

# 3. Si services ne démarrent pas
.\force-start-windows.bat
```

### **Gestion des Services**
```cmd
# Voir l'état
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart frontend

# Arrêter tout
docker-compose down

# Nettoyer tout
docker-compose down -v
docker system prune -a
```

### **Débogage**
```cmd
# Logs détaillés
docker-compose logs --tail=50

# Entrer dans un container
docker-compose exec backend sh
docker-compose exec frontend sh

# Vérifier les volumes
docker volume ls
```

## 🌐 **URLs d'Accès Windows**

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur |
| **Backend API** | http://localhost:4002 | API REST |
| **Adminer** | http://localhost:8080 | Interface base de données |
| **Admin** | http://localhost:3000/admin | Interface admin |

**Identifiants admin :**
- Email : `admin@logodouman.com`
- Mot de passe : `admin123`

## ⚠️ **Problèmes Spécifiques Windows**

### **1. Antivirus**
- Ajouter Docker aux exclusions
- Désactiver temporairement si nécessaire

### **2. Pare-feu Windows**
- Autoriser Docker Desktop
- Autoriser les ports 3000, 4002, 8080

### **3. Permissions**
- Exécuter en tant qu'administrateur
- Vérifier les permissions des dossiers

### **4. Encodage**
- Utiliser UTF-8 dans PowerShell
- Éviter les caractères spéciaux dans les chemins

## 🔧 **Optimisations Windows**

### **1. Performance Docker**
```json
{
  "resources": {
    "memory": 4096,
    "cpu": 2,
    "disk": 64
  }
}
```

### **2. WSL2 Optimisé**
```bash
# Dans WSL2
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc
echo 'export COMPOSE_DOCKER_CLI_BUILD=1' >> ~/.bashrc
```

### **3. PowerShell Optimisé**
```powershell
# Profil PowerShell
$PROFILE = "$env:USERPROFILE\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"

# Ajouter au profil
Set-Alias -Name docker-compose -Value docker compose
```

## 📊 **Monitoring Windows**

### **Vérification Système**
```powershell
# WSL2
wsl --list --verbose

# Docker
docker version
docker system df

# Services
docker-compose ps
```

### **Logs Windows**
```cmd
# Logs Docker Desktop
Get-EventLog -LogName Application -Source "Docker Desktop"

# Logs WSL2
wsl --list --verbose
```

## 🎯 **Résumé des Étapes**

1. **Prérequis** : Windows 10/11, privilèges admin
2. **Installation** : Exécuter `setup-windows.bat`
3. **Redémarrage** : Windows après installation WSL2
4. **Configuration** : Docker Desktop avec WSL2
5. **Démarrage** : `docker-compose up -d`
6. **Vérification** : Accéder aux URLs

## 🆘 **Support Windows**

### **En cas de problème :**
1. Vérifier les logs : `docker-compose logs -f`
2. Utiliser les scripts de fix : `fix-windows-build.bat`
3. Force start : `force-start-windows.bat`
4. Nettoyer et recommencer : `docker system prune -a`

### **Contact :**
- Consulter `README-WINDOWS.md`
- Vérifier les logs Docker Desktop
- Redémarrer Windows si nécessaire

---

**🎉 Votre LogoDouman est maintenant prêt sur Windows !**
