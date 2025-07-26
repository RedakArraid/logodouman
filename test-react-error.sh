#!/bin/bash

echo "🔍 Test de l'erreur React #130 - LogoDouman"
echo "============================================="

echo "📊 Vérification des services Docker..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep logodouman

echo ""
echo "🌐 Test de la page d'accueil..."
curl -s -o /dev/null -w "Page d'accueil: %{http_code}\n" http://localhost:3000

echo ""
echo "🔐 Test de la page de connexion admin..."
curl -s -o /dev/null -w "Page admin login: %{http_code}\n" http://localhost:3000/admin/login

echo ""
echo "📦 Test de la page boutique..."
curl -s -o /dev/null -w "Page boutique: %{http_code}\n" http://localhost:3000/boutique

echo ""
echo "🔧 Test de l'API backend..."
curl -s -o /dev/null -w "API backend: %{http_code}\n" http://localhost:4002/health

echo ""
echo "📋 Vérification des logs frontend (dernières 10 lignes)..."
docker logs logodouman-frontend --tail 10

echo ""
echo "🔍 Test de compilation TypeScript..."
cd frontend
npx tsc --noEmit --skipLibCheck 2>&1 | head -10
cd ..

echo ""
echo "✅ Test terminé - Vérifiez que :"
echo "1. Toutes les pages retournent 200"
echo "2. Aucune erreur React #130 dans la console"
echo "3. Les pages se chargent sans erreur côté client"
echo ""
echo "🌐 URLs à tester manuellement :"
echo "- Page d'accueil: http://localhost:3000"
echo "- Page admin login: http://localhost:3000/admin/login"
echo "- Page boutique: http://localhost:3000/boutique"
echo "- Page admin: http://localhost:3000/admin" 