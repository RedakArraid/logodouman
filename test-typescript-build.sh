#!/bin/bash

echo "🔍 Test de compilation TypeScript avant Docker"
echo "=============================================="

cd frontend

echo "📦 Vérification des types TypeScript..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ Aucune erreur TypeScript détectée"
    echo ""
    echo "🚀 Lancement de la construction Docker..."
    cd ..
    docker-compose down
    docker-compose build --no-cache frontend
    docker-compose up -d
else
    echo "❌ Erreurs TypeScript détectées. Veuillez les corriger avant de continuer."
    exit 1
fi
