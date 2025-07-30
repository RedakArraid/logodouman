@echo off
chcp 65001 >nul
echo 🐳 ======================================
echo 🔍 Diagnostic Windows - LogoDouman
echo 🐳 ======================================

echo 📋 Vérification de l'environnement...

REM Vérifier WSL2
echo 🔍 Vérification WSL2...
wsl --list --verbose
if %errorLevel% neq 0 (
    echo ❌ WSL2 n'est pas installé ou activé
) else (
    echo ✅ WSL2 est installé
)

REM Vérifier Docker
echo 🔍 Vérification Docker...
docker --version
if %errorLevel% neq 0 (
    echo ❌ Docker n'est pas installé
) else (
    echo ✅ Docker est installé
)

REM Vérifier Docker Desktop
echo 🔍 Vérification Docker Desktop...
docker ps
if %errorLevel% neq 0 (
    echo ❌ Docker Desktop ne fonctionne pas
) else (
    echo ✅ Docker Desktop fonctionne
)

REM Vérifier les images
echo 🔍 Vérification des images...
docker images | findstr logodouman
if %errorLevel% neq 0 (
    echo ❌ Images LogoDouman non trouvées
) else (
    echo ✅ Images LogoDouman trouvées
)

REM Vérifier les ports
echo 🔍 Vérification des ports...
echo Port 3000:
netstat -an | findstr :3000
echo Port 4002:
netstat -an | findstr :4002
echo Port 8080:
netstat -an | findstr :8080

REM Vérifier les services
echo 🔍 Vérification des services...
docker-compose ps

REM Tester les URLs
echo 🔍 Test des URLs...
echo Test Frontend (http://localhost:3000):
curl -s -o nul -w "%%{http_code}" http://localhost:3000
echo.
echo Test Backend (http://localhost:4002/health):
curl -s -o nul -w "%%{http_code}" http://localhost:4002/health
echo.

echo 🐳 ======================================
echo ✅ Diagnostic terminé !
echo 🐳 ======================================
pause 