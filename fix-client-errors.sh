#!/bin/bash

echo "🔧 Correction des erreurs côté client"
echo "====================================="

echo "📁 Vérification des fichiers TypeScript..."
cd frontend

echo ""
echo "🔍 Vérification des imports..."
grep -r "import.*from" app/ --include="*.ts" --include="*.tsx" | head -10

echo ""
echo "🔍 Vérification des erreurs de compilation..."
npx tsc --noEmit --skipLibCheck 2>&1 | head -20

echo ""
echo "🔍 Vérification des erreurs ESLint..."
npx eslint app/ --ext .ts,.tsx 2>&1 | head -20

echo ""
echo "🔍 Vérification des dépendances..."
npm ls --depth=0 2>&1 | head -10

echo ""
echo "🧹 Nettoyage du cache Next.js..."
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "📦 Réinstallation des dépendances..."
npm install

echo ""
echo "🔨 Rebuild du frontend..."
docker-compose restart frontend

echo ""
echo "⏳ Attente du redémarrage..."
sleep 10

echo ""
echo "🔍 Test de la page de connexion..."
curl -s http://localhost:3000/admin/login > /dev/null && echo "✅ Page accessible" || echo "❌ Page inaccessible"

echo ""
echo "✅ Correction terminée" 