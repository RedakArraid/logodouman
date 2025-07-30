@echo off
chcp 65001 >nul
echo 🐳 ======================================
echo 🔧 Fix Windows Build - LogoDouman
echo 🐳 ======================================

echo 🔍 Vérification de l'environnement Windows...

REM Vérifier WSL2
echo 📋 Vérification WSL2...
wsl --list --verbose >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ WSL2 n'est pas installé ou activé
    echo 🔧 Installation de WSL2...
    wsl --install --no-launch
    wsl --set-default-version 2
    echo ⚠️  Redémarrez Windows puis relancez ce script
    pause
    exit /b 0
) else (
    echo ✅ WSL2 est installé et activé
)

REM Vérifier Docker
echo 📋 Vérification Docker...
docker --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Docker n'est pas installé
    echo 💡 Installez Docker Desktop depuis https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
) else (
    echo ✅ Docker est installé
)

REM Vérifier Docker Desktop
docker ps >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Docker Desktop ne fonctionne pas
    echo 💡 Démarrez Docker Desktop manuellement
    pause
    exit /b 1
) else (
    echo ✅ Docker Desktop fonctionne
)

echo 🧹 Nettoyage de l'environnement Docker...

REM Arrêter les services
echo   📴 Arrêt des services...
docker-compose down

REM Nettoyer les images
echo   🗑️ Nettoyage des images...
docker system prune -a -f

REM Nettoyer les volumes
echo   🗑️ Nettoyage des volumes...
docker volume prune -f

echo 🏗️ Reconstruction des images...

REM Reconstruire avec logs détaillés
echo   🔧 Build backend...
docker-compose build --no-cache --progress=plain backend

echo   🔧 Build frontend...
docker-compose build --no-cache --progress=plain frontend

echo 🚀 Démarrage des services...

REM Démarrer les services
docker-compose up -d

echo 🔍 Vérification de l'état...

REM Vérifier l'état
docker-compose ps

echo ✅ Fix terminé !
echo 🌐 URLs d'accès :
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:4002
echo    Adminer: http://localhost:8080
echo    Admin: http://localhost:3000/admin

echo 🐳 ======================================
echo ✅ Fix Windows Build terminé !
echo 🐳 ======================================
pause 