#!/bin/bash

# 🔧 Script de Nettoyage Docker Complet - LogoDouman
# Résout les problèmes de réseau et conteneurs orphelins

echo "🔧 Nettoyage Docker complet pour LogoDouman..."
echo "==============================================="

# 🛑 Arrêter tous les conteneurs LogoDouman
echo "🛑 Arrêt de tous les conteneurs LogoDouman..."
docker stop $(docker ps -aq --filter "name=logodouman") 2>/dev/null || echo "Aucun conteneur LogoDouman en cours"

# 🗑️ Supprimer tous les conteneurs LogoDouman
echo "🗑️ Suppression des conteneurs LogoDouman..."
docker rm $(docker ps -aq --filter "name=logodouman") 2>/dev/null || echo "Aucun conteneur LogoDouman à supprimer"

# 🌐 Supprimer le réseau problématique
echo "🌐 Suppression du réseau logodouman..."
docker network rm logodouman_logodouman-network 2>/dev/null || echo "Réseau déjà supprimé"
docker network rm logodouman-network 2>/dev/null || echo "Réseau alternatif déjà supprimé"

# 📦 Nettoyer les volumes orphelins
echo "📦 Nettoyage des volumes orphelins..."
docker volume prune -f

# 🧹 Nettoyage système général
echo "🧹 Nettoyage système Docker..."
docker system prune -f

# 🔄 Supprimer les images LogoDouman pour reconstruction complète
echo "🔄 Suppression des images LogoDouman pour reconstruction..."
docker rmi $(docker images --filter="reference=logodouman*" -q) 2>/dev/null || echo "Aucune image LogoDouman à supprimer"

echo ""
echo "✅ Nettoyage Docker complet terminé !"
echo ""
echo "🚀 Vous pouvez maintenant relancer :"
echo "   ./start-complete.sh"
echo ""
echo "📊 État actuel :"
docker ps -a | grep logodouman || echo "Aucun conteneur LogoDouman"
docker network ls | grep logodouman || echo "Aucun réseau LogoDouman"
