#!/bin/bash

echo "🚀 Lancement de LogoDouman en mode développement"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Veuillez l'installer d'abord.${NC}"
    exit 1
fi

# Vérifier si Docker Compose est disponible
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas disponible.${NC}"
    exit 1
fi

# Vérifier si le fichier .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Fichier .env.local non trouvé${NC}"
    echo -e "${YELLOW}📝 Créez le fichier .env.local à partir de .env.example${NC}"
    exit 1
fi

echo -e "${YELLOW}🛑 Arrêt des services existants...${NC}"
docker-compose down

echo -e "${YELLOW}🗄️ Démarrage de la base de données et Redis...${NC}"
docker-compose up -d postgres redis

echo -e "${YELLOW}⏳ Attente du démarrage des services...${NC}"
sleep 10

# Vérifier que PostgreSQL est prêt
until docker exec logodouman-postgres pg_isready -U postgres -d logodouman; do
  echo -e "${YELLOW}⏳ Attente de PostgreSQL...${NC}"
  sleep 2
done

echo -e "${GREEN}✅ Services de base démarrés avec succès !${NC}"
echo ""
echo -e "${GREEN}🎉 LogoDouman est maintenant prêt !${NC}"
echo ""
echo -e "📊 Services disponibles :"
echo -e "  🗄️  PostgreSQL    : localhost:5432"
echo -e "  🔄  Redis          : localhost:6379"
echo -e "  🎛️  Adminer        : http://localhost:8080"
echo ""
echo -e "${YELLOW}📝 Prochaines étapes :${NC}"
echo -e "  1. Installer les dépendances frontend : ${GREEN}cd frontend && npm install${NC}"
echo -e "  2. Installer les dépendances backend  : ${GREEN}cd backend && npm install${NC}"
echo -e "  3. Lancer le frontend : ${GREEN}npm run dev${NC}"
echo -e "  4. Lancer le backend  : ${GREEN}npm run dev${NC}"
echo ""
echo -e "🔗 Connexion Adminer (Gestion BDD) :"
echo -e "  Server: ${GREEN}postgres${NC}"
echo -e "  Username: ${GREEN}postgres${NC}"
echo -e "  Password: ${GREEN}logodouman123${NC}"
echo -e "  Database: ${GREEN}logodouman${NC}"
