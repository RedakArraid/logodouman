#!/bin/bash

# 🔧 Script de Test de Build - LogoDouman Frontend
# Teste uniquement la phase de build sans Docker complet

echo "🔧 Test de build du frontend LogoDouman..."
echo "=========================================="

cd frontend

echo "📦 Installation des dépendances..."
npm install

echo "🏗️ Test de build Next.js..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi ! Aucune erreur de compilation."
    echo ""
    echo "🎉 Le frontend est prêt pour Docker !"
    echo "    Vous pouvez maintenant lancer : ./start-complete.sh"
else
    echo "❌ Erreurs de build détectées."
    echo "    Vérifiez les messages d'erreur ci-dessus."
    exit 1
fi
