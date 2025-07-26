#!/bin/bash

echo "🔍 Diagnostic Frontend LogoDouman"
echo "=================================="

# Vérifier les services Docker
echo "📦 Vérification des services Docker..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 Test de connectivité Frontend..."
curl -s -o /dev/null -w "Frontend (port 3000): %{http_code}\n" http://localhost:3000

echo ""
echo "🔧 Test de connectivité Backend..."
curl -s -o /dev/null -w "Backend (port 4002): %{http_code}\n" http://localhost:4002

echo ""
echo "📊 Test API Backend..."
curl -s http://localhost:4002/health | jq . 2>/dev/null || echo "❌ jq non installé, réponse brute:"
curl -s http://localhost:4002/health

echo ""
echo "🔐 Test Authentification..."
curl -s -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@logodouman.com","password":"admin123"}' | jq . 2>/dev/null || echo "❌ jq non installé"

echo ""
echo "📁 Vérification des fichiers frontend..."
ls -la frontend/app/admin/
ls -la frontend/app/config/
ls -la frontend/app/data/

echo ""
echo "🔍 Logs Frontend (dernières 20 lignes)..."
docker logs logodouman-frontend --tail 20

echo ""
echo "🔍 Logs Backend (dernières 10 lignes)..."
docker logs logodouman-backend --tail 10

echo ""
echo "✅ Diagnostic terminé" 