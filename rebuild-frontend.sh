#!/bin/bash

echo "🔄 Reconstruction Frontend LogoDouman"
echo "====================================="

# 1. Arrêter le frontend
echo "🛑 Arrêt du frontend..."
docker-compose stop frontend

# 2. Supprimer l'image frontend pour forcer la reconstruction
echo "🗑️ Suppression de l'ancienne image frontend..."
docker rmi $(docker images | grep logodouman-frontend | awk '{print $3}') 2>/dev/null || echo "Image déjà supprimée"

# 3. Nettoyer le cache Docker
echo "🧹 Nettoyage du cache Docker..."
docker builder prune -f

# 4. Reconstruire le frontend
echo "🔨 Reconstruction du frontend..."
docker-compose build --no-cache frontend

# 5. Redémarrer le frontend
echo "🚀 Redémarrage du frontend..."
docker-compose up frontend -d

# 6. Attendre et vérifier
echo "⏳ Attente du démarrage (30 secondes)..."
sleep 30

echo "🔍 Vérification de l'état..."
if docker-compose ps frontend | grep -q "Up"; then
    echo "✅ Frontend redémarré avec succès !"
    echo ""
    echo "🌐 Testez maintenant :"
    echo "   • Site : http://localhost:3000"
    echo "   • Admin : http://localhost:3000/admin/login"
    echo ""
    echo "📋 Logs en temps réel :"
    echo "   docker-compose logs -f frontend"
else
    echo "❌ Problème avec le frontend"
    echo "📋 Voir les logs : docker-compose logs frontend"
fi
