#!/bin/bash

echo "🚀 LogoDouman Admin v2.0 - Démarrage complet"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

print_status "Vérification de l'environnement..."

# Arrêter les conteneurs existants
print_status "Arrêt des conteneurs existants..."
docker-compose down

# Démarrer les services de base
print_status "Démarrage des services de base (PostgreSQL, Redis, Adminer)..."
docker-compose up -d postgres redis adminer

# Attendre que PostgreSQL soit prêt
print_status "Attente que PostgreSQL soit prêt..."
sleep 10

# Installer les dépendances backend
print_status "Installation des dépendances backend..."
cd backend
npm install

# Générer le client Prisma
print_status "Génération du client Prisma..."
npx prisma generate

# Pousser le schéma vers la base de données
print_status "Migration de la base de données..."
npx prisma db push

# Exécuter la migration avec données de test
print_status "Création des données de test..."
npm run migrate

cd ..

# Installer les dépendances frontend
print_status "Installation des dépendances frontend..."
cd frontend
npm install
cd ..

# Démarrer tous les services
print_status "Démarrage de tous les services..."
docker-compose up -d

# Attendre que tous les services soient prêts
print_status "Attente que tous les services soient prêts..."
sleep 15

print_success "🎉 LogoDouman Admin v2.0 est maintenant opérationnel !"
echo ""
echo "📊 URLs d'accès :"
echo "   🌐 Frontend (Site client) : http://localhost:3000"
echo "   🔧 Admin Dashboard        : http://localhost:3000/admin"
echo "   📡 API Backend           : http://localhost:4002"
echo "   🗄️  Adminer (Base de données) : http://localhost:8080"
echo ""
echo "🔑 Identifiants Admin :"
echo "   📧 Email    : admin@logodouman.com"
echo "   🔐 Mot de passe : admin123"
echo ""
echo "📋 Nouvelles fonctionnalités disponibles :"
echo "   ✅ Gestion complète des commandes"
echo "   ✅ Analyse client avancée"
echo "   ✅ Système de promotions"
echo "   ✅ Tableau de bord avec métriques"
echo "   ✅ Alertes automatisées"
echo "   ✅ Gestion d'inventaire avancée"
echo ""
echo "📚 Documentation :"
echo "   📖 Fonctionnalités : ADMIN_FEATURES.md"
echo "   🔧 API : http://localhost:4002 (endpoints listés)"
echo ""
echo "🛠️  Commandes utiles :"
echo "   📊 Voir les logs : docker-compose logs -f"
echo "   🛑 Arrêter : docker-compose down"
echo "   🔄 Redémarrer : docker-compose restart"
echo ""
print_success "🚀 Prêt pour la production !" 