@echo off
chcp 65001 >nul
echo 🐳 ======================================
echo 🔍 Debug Windows Build - LogoDouman
echo 🐳 ======================================

echo 📋 Vérification de l'environnement...

REM Vérifier Docker Desktop
echo 🔍 Vérification Docker Desktop...
docker version
if %errorLevel% neq 0 (
    echo ❌ Docker Desktop ne fonctionne pas
    echo 💡 Démarrez Docker Desktop manuellement
    pause
    exit /b 1
) else (
    echo ✅ Docker Desktop fonctionne
)

REM Vérifier WSL2
echo 🔍 Vérification WSL2...
wsl --list --verbose
if %errorLevel% neq 0 (
    echo ❌ WSL2 n'est pas installé ou activé
) else (
    echo ✅ WSL2 est installé
)

REM Vérifier les fichiers
echo 🔍 Vérification des fichiers...
if exist "backend\Dockerfile" (
    echo ✅ Backend Dockerfile trouvé
) else (
    echo ❌ Backend Dockerfile manquant
)

if exist "frontend\Dockerfile" (
    echo ✅ Frontend Dockerfile trouvé
) else (
    echo ❌ Frontend Dockerfile manquant
)

if exist "docker-compose.yml" (
    echo ✅ docker-compose.yml trouvé
) else (
    echo ❌ docker-compose.yml manquant
)

REM Tester le build backend
echo 🔍 Test build backend...
echo ======================================
docker-compose build --no-cache --progress=plain backend
echo ======================================

REM Tester le build frontend
echo 🔍 Test build frontend...
echo ======================================
docker-compose build --no-cache --progress=plain frontend
echo ======================================

REM Vérifier les images construites
echo 🔍 Vérification des images...
docker images | findstr logodouman

REM Vérifier les services
echo 🔍 Vérification des services...
docker-compose ps

echo 🐳 ======================================
echo ✅ Debug terminé !
echo 🐳 ======================================
pause 