#!/bin/bash

echo "🚀 Lancement de LogoDouman en mode développement (Sans Docker)"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL n'est pas installé.${NC}"
    echo -e "${YELLOW}📦 Installation avec Homebrew :${NC}"
    echo -e "   brew install postgresql@15"
    echo -e "   brew services start postgresql@15"
    exit 1
fi

# Vérifier si Redis est installé
if ! command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️ Redis n'est pas installé. Installation...${NC}"
    brew install redis
    brew services start redis
fi

# Vérifier si PostgreSQL fonctionne
if ! pg_isready -q; then
    echo -e "${YELLOW}🗄️ Démarrage de PostgreSQL...${NC}"
    brew services start postgresql@15
    sleep 3
fi

# Vérifier si Redis fonctionne
if ! redis-cli ping &> /dev/null; then
    echo -e "${YELLOW}🔄 Démarrage de Redis...${NC}"
    brew services start redis
    sleep 2
fi

# Créer la base de données si elle n'existe pas
if ! psql -lqt | cut -d \| -f 1 | grep -qw logodouman; then
    echo -e "${YELLOW}🗄️ Création de la base de données logodouman...${NC}"
    createdb logodouman
fi

echo -e "${GREEN}✅ Services locaux démarrés avec succès !${NC}"
echo ""
echo -e "${GREEN}🎉 LogoDouman est maintenant prêt !${NC}"
echo ""
echo -e "📊 Services disponibles :"
echo -e "  🗄️  PostgreSQL    : localhost:5432"
echo -e "  🔄  Redis          : localhost:6379"
echo ""
echo -e "${YELLOW}📝 Prochaines étapes :${NC}"
echo -e "  1. Terminal 1 - Backend : ${GREEN}cd backend && npm install && npm run dev${NC}"
echo -e "  2. Terminal 2 - Frontend: ${GREEN}cd frontend && npm install && npm run dev${NC}"
echo ""
echo -e "🔗 URLs de test :"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:4000${NC}"
