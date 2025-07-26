#!/bin/bash

# 🔧 Test de Build Rapide - Validation TypeScript uniquement
# Teste la compilation TypeScript sans le build complet

echo "🔧 Validation TypeScript pour LogoDouman..."
echo "============================================"

cd frontend

echo "📋 Vérification des types TypeScript..."
npx tsc --noEmit --skipLibCheck

if [ $? -eq 0 ]; then
    echo "✅ Validation TypeScript réussie !"
    echo ""
    echo "🏗️ Lancement du build complet..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 BUILD COMPLET RÉUSSI !"
        echo "✅ Aucune erreur de compilation"
        echo "✅ Aucune erreur TypeScript"
        echo ""
        echo "🚀 Prêt pour Docker : ./start-complete.sh"
    else
        echo "❌ Erreur lors du build complet"
        exit 1
    fi
else
    echo "❌ Erreurs TypeScript détectées"
    echo "    Vérifiez les types ci-dessus"
    exit 1
fi
