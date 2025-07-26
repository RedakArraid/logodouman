#!/bin/bash

# 🚀 Script de Démarrage Robuste - LogoDouman Docker
# Gère automatiquement les problèmes de réseau et redémarre proprement

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

# 🧹 Fonction de nettoyage automatique en cas d'erreur
cleanup_on_error() {
    print_warning "Nettoyage automatique en cas d'erreur réseau..."
    
    # Arrêter tous les services
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Supprimer le réseau problématique
    docker network rm logodouman_logodouman-network 2>/dev/null || true
    docker network rm logodouman-network 2>/dev/null || true
    
    # Nettoyage léger
    docker system prune -f 2>/dev/null || true
    
    print_success "Nettoyage automatique terminé"
}

# 🔍 Vérification des prérequis
check_prerequisites() {
    print_step "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker n'est pas en cours d'exécution"
        exit 1
    fi
    
    print_success "Prérequis OK"
}

# 🏗️ Construction des images avec gestion d'erreur
build_images() {
    print_step "Construction des images Docker..."
    
    if docker-compose build --no-cache --parallel; then
        print_success "Images construites avec succès"
    else
        print_error "Erreur lors de la construction des images"
        cleanup_on_error
        exit 1
    fi
}

# 🚀 Démarrage robuste des services
start_services_robust() {
    print_step "Démarrage robuste des services..."
    
    # Tentative 1: Démarrage normal
    print_step "Tentative 1: Démarrage normal..."
    if docker-compose up -d; then
        print_success "Services démarrés normalement"
        return 0
    fi
    
    # Tentative 2: Nettoyage et redémarrage
    print_warning "Tentative 1 échouée, nettoyage et nouvelle tentative..."
    cleanup_on_error
    sleep 5
    
    print_step "Tentative 2: Redémarrage après nettoyage..."
    if docker-compose up -d; then
        print_success "Services démarrés après nettoyage"
        return 0
    fi
    
    # Tentative 3: Reconstruction complète
    print_warning "Tentative 2 échouée, reconstruction complète..."
    docker-compose down -v --rmi all --remove-orphans 2>/dev/null || true
    sleep 5
    
    print_step "Tentative 3: Reconstruction et démarrage..."
    if docker-compose build --no-cache && docker-compose up -d; then
        print_success "Services démarrés après reconstruction"
        return 0
    fi
    
    print_error "Impossible de démarrer les services après 3 tentatives"
    return 1
}

# 🔍 Vérification de l'état des services
check_services() {
    print_step "Vérification de l'état des services..."
    
    # Attendre que les services soient prêts
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
        
        if timeout 10 curl -s "$url" > /dev/null 2>&1; then
            print_success "$name est accessible"
        else
            print_warning "$name n'est pas encore accessible (normal au premier démarrage)"
        fi
    done
}

# 📊 Affichage de l'état final
show_final_status() {
    print_header "ÉTAT FINAL DES SERVICES"
    
    echo "${GREEN}📊 Conteneurs LogoDouman :${NC}"
    docker-compose ps
    
    echo ""
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
    
    echo "${PURPLE}🎉 LogoDouman est prêt !${NC}"
}

# 🚀 SCRIPT PRINCIPAL
main() {
    print_header "DÉMARRAGE ROBUSTE LOGODOUMAN"
    
    # Vérifications préliminaires
    check_prerequisites
    
    # Construction des images
    build_images
    
    # Démarrage robuste avec retry automatique
    if start_services_robust; then
        print_success "Tous les services démarrés avec succès"
        
        # Vérification de l'état
        check_services
        
        # Affichage final
        show_final_status
    else
        print_error "Échec du démarrage après toutes les tentatives"
        print_step "Vous pouvez essayer un nettoyage manuel :"
        print_step "  ./clean-docker.sh"
        print_step "  ./start-robust.sh"
        exit 1
    fi
}

# 🎯 Gestion des erreurs
trap 'echo -e "${RED}❌ Erreur détectée. Nettoyage automatique...${NC}"; cleanup_on_error' ERR

# 🚀 Exécution du script principal
main "$@"
