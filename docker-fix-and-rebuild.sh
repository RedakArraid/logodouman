#!/bin/bash

echo "🔧 Correction des erreurs TypeScript et reconstruction Docker"
echo "==========================================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}📦 Nettoyage des containers existants...${NC}"
docker-compose down

echo ""
echo -e "${YELLOW}🧹 Nettoyage du cache Docker...${NC}"
docker builder prune -f

echo ""
echo -e "${YELLOW}🔨 Reconstruction des images...${NC}"
docker-compose build --no-cache

echo ""
echo -e "${YELLOW}🚀 Démarrage des services...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Vérification des services...${NC}"
docker-compose ps

echo ""
echo "🎯 Services disponibles:"
echo "• Frontend: http://localhost:3000"
echo "• Backend: http://localhost:4002"
echo "• Admin: http://localhost:3000/admin/login"
echo "• Test Upload: http://localhost:3000/test-upload-simple"
echo ""
echo -e "${GREEN}🎉 LogoDouman est maintenant prêt avec l'upload d'images !${NC}"
