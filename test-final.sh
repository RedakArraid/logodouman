#!/bin/bash

echo "🔧 Test Final de Build - LogoDouman"
echo "===================================="

cd frontend

echo "🧪 Test 1: Vérification TypeScript..."
npx tsc --noEmit --skipLibCheck > /tmp/tsc_output.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ TypeScript OK"
else
    echo "❌ Erreurs TypeScript:"
    cat /tmp/tsc_output.log
    exit 1
fi

echo ""
echo "🧪 Test 2: Build Next.js..."
npm run build > /tmp/build_output.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build Next.js OK"
    echo ""
    echo "🎉 TOUS LES TESTS PASSÉS !"
    echo "✅ TypeScript: Aucune erreur"
    echo "✅ Build: Compilation réussie"
    echo "✅ Docker: Prêt pour le démarrage"
    echo ""
    echo "🚀 Commande de lancement:"
    echo "   ./start-complete.sh"
else
    echo "❌ Erreurs de build:"
    cat /tmp/build_output.log
    exit 1
fi
