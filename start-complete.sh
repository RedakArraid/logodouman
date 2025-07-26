#!/bin/bash

# 🚀 Script de Démarrage Complet LogoDouman - Docker Compose
# Version Corrigée et Optimisée

set -e

# 🎨 Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 📋 Fonction d'affichage avec style
print_header() {
    echo ""
    echo "${BLUE}🐳 ============================================${NC}"
    echo "${BLUE}🚀 $1${NC}"
    echo "${BLUE}🐳 ============================================${NC}"
    echo ""
}

print_step() {
    echo "${CYAN}📍 $1${NC}"
}

print_success() {
    echo "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo "${RED}❌ $1${NC}"
}

# 🧹 Fonction de nettoyage
cleanup_docker() {
    print_step "Nettoyage des conteneurs existants..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    print_success "Nettoyage terminé"
}

# 🔍 Vérification des prérequis
check_prerequisites() {
    print_step "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé"
        exit 1
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    # Vérifier que Docker est en cours d'exécution
    if ! docker info &> /dev/null; then
        print_error "Docker n'est pas en cours d'exécution"
        exit 1
    fi
    
    print_success "Prérequis OK"
}

# 🏗️ Construction des images
build_images() {
    print_step "Construction des images Docker..."
    
    # Construction avec cache optimisé
    docker-compose build --no-cache --parallel --progress=plain
    
    if [ $? -eq 0 ]; then
        print_success "Images construites avec succès"
    else
        print_error "Erreur lors de la construction des images"
        exit 1
    fi
}

# 🚀 Démarrage des services
start_services() {
    print_step "Démarrage des services..."
    
    # Démarrer les services de base d'abord
    print_step "Démarrage PostgreSQL et Redis..."
    docker-compose up -d postgres redis
    
    # Attendre que les services de base soient prêts
    print_step "Attente de PostgreSQL et Redis..."
    sleep 20
    
    # Vérifier l'état des services de base
    if ! docker-compose ps postgres | grep -q "healthy\|Up"; then
        print_error "PostgreSQL n'est pas prêt"
        docker-compose logs postgres
        exit 1
    fi
    
    if ! docker-compose ps redis | grep -q "healthy\|Up"; then
        print_error "Redis n'est pas prêt"
        docker-compose logs redis
        exit 1
    fi
    
    print_success "Services de base prêts"
    
    # Démarrer le backend
    print_step "Démarrage du Backend..."
    docker-compose up -d backend
    
    # Attendre le backend
    print_step "Attente du Backend..."
    sleep 30
    
    # Vérifier le backend
    if ! docker-compose ps backend | grep -q "healthy\|Up"; then
        print_error "Backend n'est pas prêt"
        docker-compose logs backend
        exit 1
    fi
    
    print_success "Backend prêt"
    
    # Démarrer le frontend
    print_step "Démarrage du Frontend..."
    docker-compose up -d frontend
    
    # Démarrer Adminer
    print_step "Démarrage d'Adminer..."
    docker-compose up -d adminer
    
    print_success "Tous les services démarrés"
}

# 🔍 Vérification des services
check_services() {
    print_step "Vérification des services..."
    
    # Attendre que tous les services soient prêts
    sleep 30
    
    # URLs à tester
    local urls=(
        "http://localhost:3000|Frontend"
        "http://localhost:4002/health|Backend API"
        "http://localhost:8080|Adminer"
    )
    
    for url_info in "${urls[@]}"; do
        IFS='|' read -r url name <<< "$url_info"
        
        print_step "Test de $name ($url)..."
        
        # Test avec curl avec timeout
        if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
            print_success "$name est accessible"
        else
            print_warning "$name n'est pas encore accessible (normal au premier démarrage)"
        fi
    done
}

# 📊 Affichage des informations finales
show_info() {
    print_header "LOGODOUMAN DÉMARRÉ AVEC SUCCÈS !"
    
    echo "${GREEN}🌐 URLs d'accès :${NC}"
    echo "  ${CYAN}🛍️  Site principal    : ${YELLOW}http://localhost:3000${NC}"
    echo "  ${CYAN}⚙️  Administration    : ${YELLOW}http://localhost:3000/admin${NC}"
    echo "  ${CYAN}🔧 API Backend       : ${YELLOW}http://localhost:4002${NC}"
    echo "  ${CYAN}🗄️  Adminer (DB)      : ${YELLOW}http://localhost:8080${NC}"
    echo ""
    
    echo "${GREEN}👤 Compte administrateur :${NC}"
    echo "  ${CYAN}📧 Email    : ${YELLOW}admin@logodouman.com${NC}"
    echo "  ${CYAN}🔑 Password : ${YELLOW}admin123${NC}"
    echo ""
    
    echo "${GREEN}🗄️  Base de données :${NC}"
    echo "  ${CYAN}🏠 Host     : ${YELLOW}localhost:55432${NC}"
    echo "  ${CYAN}📊 Database : ${YELLOW}logodouman${NC}"
    echo "  ${CYAN}👤 User     : ${YELLOW}postgres${NC}"
    echo "  ${CYAN}🔑 Password : ${YELLOW}logodouman123${NC}"
    echo ""
    
    echo "${GREEN}🔧 Commandes utiles :${NC}"
    echo "  ${CYAN}📊 Voir les logs        : ${YELLOW}docker-compose logs -f${NC}"
    echo "  ${CYAN}📊 Status des services  : ${YELLOW}docker-compose ps${NC}"
    echo "  ${CYAN}🔄 Redémarrer          : ${YELLOW}docker-compose restart${NC}"
    echo "  ${CYAN}🛑 Arrêter             : ${YELLOW}docker-compose down${NC}"
    echo ""
    
    echo "${PURPLE}🎉 Votre plateforme e-commerce LogoDouman est prête !${NC}"
    echo "${PURPLE}🚀 Visitez http://localhost:3000 pour commencer${NC}"
}

# 📊 Affichage du statut des conteneurs
show_containers_status() {
    print_step "État des conteneurs :"
    docker-compose ps
    echo ""
}

# 🚀 SCRIPT PRINCIPAL
main() {
    print_header "DÉMARRAGE LOGODOUMAN - DOCKER COMPOSE"
    
    # Vérifications préliminaires
    check_prerequisites
    
    # Nettoyage (optionnel)
    if [[ "$1" == "--clean" ]]; then
        cleanup_docker
    fi
    
    # Construction des images
    build_images
    
    # Démarrage des services
    start_services
    
    # Vérification des services
    check_services
    
    # Affichage du statut
    show_containers_status
    
    # Informations finales
    show_info
}

# 🎯 Gestion des erreurs
trap 'echo -e "${RED}❌ Erreur détectée. Arrêt du script.${NC}"' ERR

# 🚀 Exécution du script principal
main "$@"
