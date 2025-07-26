#!/bin/bash

echo "🧹 Nettoyage complet et test de build - LogoDouman"
echo "================================================="

cd frontend

echo "🗑️ Suppression du cache Next.js..."
rm -rf .next

echo "🗑️ Suppression des node_modules..."
rm -rf node_modules

echo "📦 Réinstallation des dépendances..."
npm install

echo "🔍 Vérification TypeScript..."
npx tsc --noEmit --skipLibCheck

if [ $? -eq 0 ]; then
    echo "✅ TypeScript OK"
else
    echo "❌ Erreurs TypeScript persistantes"
    exit 1
fi

echo ""
echo "🏗️ Build Next.js complet..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD RÉUSSI APRÈS NETTOYAGE !"
    echo "✅ Cache vidé"
    echo "✅ Dépendances réinstallées"
    echo "✅ TypeScript validé"
    echo "✅ Build Next.js réussi"
    echo ""
    echo "🚀 Prêt pour Docker : ./start-complete.sh"
else
    echo "❌ Erreurs de build persistantes"
    exit 1
fi
