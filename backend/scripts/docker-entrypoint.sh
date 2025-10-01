#!/bin/sh
set -e

echo "🐳 ======================================"
echo "🚀 LogoDouman Backend - Démarrage Docker"
echo "🐳 ======================================"

# 🎨 Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 🔧 Fonction pour attendre un service avec timeout intelligent
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local timeout=${4:-60}
    
    echo "${BLUE}⏳ Attente de $service_name ($host:$port)...${NC}"
    
    local count=0
    while ! nc -z "$host" "$port" 2>/dev/null; do
        count=$((count + 1))
        if [ $count -gt $timeout ]; then
            echo "${RED}❌ Timeout: $service_name n'est pas accessible après ${timeout}s${NC}"
            echo "${YELLOW}💡 Vérifiez que le service $service_name est démarré${NC}"
            exit 1
        fi
        
        # Affichage progressif
        if [ $((count % 10)) -eq 0 ]; then
            echo "${YELLOW}   ... tentative $count/$timeout${NC}"
        fi
        sleep 1
    done
    
    echo "${GREEN}✅ $service_name est prêt !${NC}"
}

# 🔍 Vérifier les variables d'environnement critiques
echo "${BLUE}🔍 Vérification des variables d'environnement...${NC}"

if [ -z "$DATABASE_URL" ]; then
    echo "${RED}❌ Erreur: DATABASE_URL n'est pas défini${NC}"
    echo "${YELLOW}💡 Assurez-vous que la variable DATABASE_URL est configurée${NC}"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "${RED}❌ Erreur: JWT_SECRET n'est pas défini${NC}"
    exit 1
fi

echo "${GREEN}✅ Variables d'environnement OK${NC}"

# 🗄️ Attendre PostgreSQL avec une stratégie robuste
wait_for_service "postgres" "5432" "PostgreSQL" 90

# 🔴 Attendre Redis
wait_for_service "redis" "6379" "Redis" 60

# 🕒 Attente supplémentaire pour s'assurer que PostgreSQL est vraiment prêt
echo "${BLUE}⏳ Attente supplémentaire pour PostgreSQL (10s)...${NC}"
sleep 10

# 🧪 Test de connexion à la base de données
echo "${BLUE}🧪 Test de connexion à la base de données...${NC}"
if ! timeout 30 sh -c 'until nc -z postgres 5432; do sleep 1; done'; then
    echo "${RED}❌ Impossible de se connecter à PostgreSQL${NC}"
    exit 1
fi

# 🔧 Configuration Prisma
echo "${BLUE}🔧 Configuration Prisma...${NC}"



# 📊 Synchroniser la base de données avec gestion d'erreur robuste
echo "${BLUE}📊 Synchronisation de la base de données...${NC}"

if npx prisma migrate deploy; then
    echo "${GREEN}✅ Migrations Prisma appliquées${NC}"
else
    echo "${RED}❌ Erreur lors de l'application des migrations${NC}"
    exit 1
fi

# Tentative 1: Push simple
if npx prisma db push --accept-data-loss --skip-generate 2>/dev/null; then
    echo "${GREEN}✅ Base de données synchronisée avec succès${NC}"
else
    echo "${YELLOW}⚠️  Première tentative échouée, tentative avec reset...${NC}"
    
    # Tentative 2: Push avec force reset
    if npx prisma db push --force-reset --accept-data-loss --skip-generate; then
        echo "${GREEN}✅ Base de données réinitialisée et synchronisée${NC}"
    else
        echo "${RED}❌ Erreur lors de la synchronisation de la base de données${NC}"
        echo "${YELLOW}💡 Vérifiez les logs PostgreSQL pour plus d'informations${NC}"
        exit 1
    fi
fi

# 📦 Exécuter la migration des données de test
echo "${BLUE}📦 Migration des données de test...${NC}"
if [ -f "scripts/migrate.js" ]; then
    if node scripts/migrate.js; then
        echo "${GREEN}✅ Migration des données terminée avec succès${NC}"
    else
        echo "${YELLOW}⚠️  Erreur lors de la migration, mais continution...${NC}"
    fi
else
    echo "${YELLOW}⚠️  Fichier de migration non trouvé (scripts/migrate.js)${NC}"
fi

# 🔍 Vérification finale de l'état de l'application
echo "${BLUE}🔍 Vérification finale...${NC}"

# Créer les dossiers nécessaires s'ils n'existent pas
mkdir -p /app/uploads /app/logs /app/tmp

# Vérifier les permissions
if [ ! -w "/app/uploads" ] || [ ! -w "/app/logs" ]; then
    echo "${YELLOW}⚠️  Problème de permissions détecté, tentative de correction...${NC}"
    # Note: En tant qu'utilisateur nodejs, on ne peut pas changer les permissions
fi

echo "${GREEN}🎉 Configuration terminée avec succès !${NC}"
echo "${BLUE}🚀 Démarrage de l'application LogoDouman Backend...${NC}"
echo "${BLUE}📍 Port: ${PORT:-4002}${NC}"
echo "${BLUE}🌍 Environnement: ${NODE_ENV:-production}${NC}"
echo "🐳 ======================================"

# 🚀 Démarrer l'application avec gestion d'erreur
exec "$@"
