@echo off
chcp 65001 >nul
echo 🐳 ======================================
echo 🚀 Force Start Windows - LogoDouman
echo 🐳 ======================================

echo 🛑 Arrêt de tous les services...
docker-compose down

echo 🧹 Nettoyage complet...
docker system prune -a -f
docker volume prune -f

echo 🏗️ Reconstruction des images...
docker-compose build --no-cache backend
docker-compose build --no-cache frontend

echo 🚀 Démarrage forcé des services...

REM Démarrer les services un par un
echo   📦 Démarrage PostgreSQL...
docker-compose up -d postgres

echo   🔴 Démarrage Redis...
docker-compose up -d redis

echo   🔧 Démarrage Backend...
docker-compose up -d backend

echo   🌐 Démarrage Frontend...
docker-compose up -d frontend

echo   🗄️ Démarrage Adminer...
docker-compose up -d adminer

echo ⏳ Attente du démarrage...
timeout /t 30 /nobreak

echo 🔍 Vérification de l'état...
docker-compose ps

echo 🌐 Test des URLs...
echo Test Frontend:
curl -s -o nul -w "%%{http_code}" http://localhost:3000
echo.
echo Test Backend:
curl -s -o nul -w "%%{http_code}" http://localhost:4002/health
echo.

echo ✅ Force Start terminé !
echo 🌐 URLs d'accès :
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:4002
echo    Adminer: http://localhost:8080
echo    Admin: http://localhost:3000/admin

echo 🐳 ======================================
echo ✅ Force Start Windows terminé !
echo 🐳 ======================================
pause 