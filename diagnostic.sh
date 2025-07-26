#!/bin/bash

# 🔍 Script de Diagnostic LogoDouman - Docker
# Détecte et corrige automatiquement les problèmes

set -e

# 🎨 Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo ""
    echo "${BLUE}🔍 ============================================${NC}"
    echo "${BLUE}🔍 $1${NC}"
    echo "${BLUE}🔍 ============================================${NC}"
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

print_info() {
    echo "${PURPLE}ℹ️  $1${NC}"
}

# 🔍 Diagnostic Docker
check_docker() {
    print_step "Diagnostic Docker..."
    
    # Docker installé ?
    if command -v docker &> /dev/null; then
        local docker_version=$(docker --version)
        print_success "Docker installé : $docker_version"
    else
        print_error "Docker n'est pas installé"
        return 1
    fi
    
    # Docker en cours d'exécution ?
    if docker info &> /dev/null; then
        print_success "Docker daemon en cours d'exécution"
    else
        print_error "Docker daemon n'est pas en cours d'exécution"
        print_info "Démarrez Docker Desktop ou le service Docker"
        return 1
    fi
    
    # Docker Compose disponible ?
    if command -v docker-compose &> /dev/null; then
        local compose_version=$(docker-compose --version)
        print_success "Docker Compose disponible : $compose_version"
    else
        print_error "Docker Compose n'est pas installé"
        return 1
    fi
    
    # Espace disque disponible ?
    local available_space=$(df -h . | awk 'NR==2 {print $4}')
    print_info "Espace disque disponible : $available_space"
    
    return 0
}

# 🔍 Diagnostic des fichiers de configuration
check_config_files() {
    print_step "Vérification des fichiers de configuration..."
    
    local files=(
        "docker-compose.yml"
        "frontend/Dockerfile"
        "backend/Dockerfile"
        "frontend/.env.docker"
        "backend/.env.docker"
        "backend/scripts/docker-entrypoint.sh"
        "backend/prisma/schema.prisma"
    )
    
    for file in "${files[@]}"; do
        if [[ -f "$file" ]]; then
            print_success "$file trouvé"
        else
            print_error "$file manquant"
        fi
    done
}

# 🔍 Diagnostic des conteneurs
check_containers() {
    print_step "État des conteneurs..."
    
    local containers=(
        "logodouman-postgres"
        "logodouman-redis"
        "logodouman-backend"
        "logodouman-frontend"
        "logodouman-adminer"
    )
    
    for container in "${containers[@]}"; do
        if docker ps -a --format "table {{.Names}}" | grep -q "^$container$"; then
            local status=$(docker ps -a --filter "name=$container" --format "{{.Status}}")
            if [[ $status == *"Up"* ]]; then
                print_success "$container : $status"
            else
                print_warning "$container : $status"
            fi
        else
            print_info "$container : Non créé"
        fi
    done
}

# 🔍 Test de connectivité des services
test_connectivity() {
    print_step "Test de connectivité des services..."
    
    local services=(
        "localhost:3000|Frontend"
        "localhost:4002|Backend"
        "localhost:8080|Adminer"
        "localhost:55432|PostgreSQL"
        "localhost:6379|Redis"
    )
    
    for service in "${services[@]}"; do
        IFS='|' read -r endpoint name <<< "$service"
        IFS=':' read -r host port <<< "$endpoint"
        
        if timeout 3 bash -c "</dev/tcp/$host/$port" 2>/dev/null; then
            print_success "$name ($endpoint) accessible"
        else
            print_warning "$name ($endpoint) non accessible"
        fi
    done
}

# 🔍 Vérification des logs
check_logs() {
    print_step "Analyse des logs récents..."
    
    local containers=("backend" "frontend" "postgres" "redis")
    
    for container in "${containers[@]}"; do
        if docker-compose ps "$container" &>/dev/null; then
            echo ""
            echo "${YELLOW}📋 Logs récents de $container :${NC}"
            docker-compose logs --tail=5 "$container" 2>/dev/null || print_warning "Pas de logs pour $container"
        fi
    done
}

# 🔍 Vérification de l'espace disque
check_disk_space() {
    print_step "Vérification de l'espace disque Docker..."
    
    # Espace utilisé par Docker
    local docker_space=$(docker system df --format "table {{.Type}}\t{{.TotalCount}}\t{{.Size}}" 2>/dev/null || echo "Erreur")
    
    if [[ "$docker_space" != "Erreur" ]]; then
        echo "${YELLOW}📊 Utilisation Docker :${NC}"
        echo "$docker_space"
    else
        print_warning "Impossible d'obtenir les informations d'espace Docker"
    fi
    
    # Volumes Docker
    echo ""
    echo "${YELLOW}📦 Volumes Docker :${NC}"
    docker volume ls --filter "name=logodouman" --format "table {{.Name}}\t{{.Driver}}" 2>/dev/null || print_warning "Aucun volume LogoDouman trouvé"
}

# 🔧 Actions de correction automatique
auto_fix() {
    print_step "Tentative de correction automatique..."
    
    # Nettoyer les conteneurs orphelins
    print_step "Nettoyage des conteneurs orphelins..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Nettoyer les ressources inutilisées
    print_step "Nettoyage des ressources Docker inutilisées..."
    docker system prune -f 2>/dev/null || true
    
    # Reconstruire les images si nécessaire
    if [[ "$1" == "--rebuild" ]]; then
        print_step "Reconstruction des images..."
        docker-compose build --no-cache
    fi
    
    print_success "Corrections automatiques appliquées"
}

# 📊 Résumé du diagnostic
show_summary() {
    print_header "RÉSUMÉ DU DIAGNOSTIC"
    
    # Compter les erreurs et avertissements
    # (Ceci serait plus complexe dans un vrai script, mais pour l'exemple...)
    
    echo "${GREEN}🎯 Actions recommandées :${NC}"
    echo "  ${CYAN}1. ${NC}Si des services ne répondent pas : ${YELLOW}./diagnostic.sh --rebuild${NC}"
    echo "  ${CYAN}2. ${NC}Pour redémarrer complètement : ${YELLOW}./start-complete.sh --clean${NC}"
    echo "  ${CYAN}3. ${NC}Pour voir les logs détaillés : ${YELLOW}docker-compose logs -f${NC}"
    echo "  ${CYAN}4. ${NC}Pour vérifier la santé : ${YELLOW}docker-compose ps${NC}"
    echo ""
    
    echo "${GREEN}📚 Documentation :${NC}"
    echo "  ${CYAN}• ${NC}README.md pour les instructions détaillées"
    echo "  ${CYAN}• ${NC}ETAT_ACTUEL_PROJET.md pour l'état du projet"
    echo "  ${CYAN}• ${NC}ADMIN_FEATURES.md pour les fonctionnalités admin"
    echo ""
    
    echo "${PURPLE}🔍 Diagnostic terminé !${NC}"
}

# 🚀 SCRIPT PRINCIPAL
main() {
    print_header "DIAGNOSTIC LOGODOUMAN - DOCKER"
    
    # Diagnostic Docker
    if ! check_docker; then
        print_error "Problèmes critiques avec Docker détectés"
        exit 1
    fi
    
    # Vérification des fichiers de configuration
    check_config_files
    
    # État des conteneurs
    check_containers
    
    # Test de connectivité
    test_connectivity
    
    # Vérification de l'espace disque
    check_disk_space
    
    # Analyse des logs
    check_logs
    
    # Correction automatique si demandée
    if [[ "$1" == "--fix" ]] || [[ "$1" == "--rebuild" ]]; then
        auto_fix "$1"
    fi
    
    # Résumé
    show_summary
}

# 🎯 Gestion des erreurs
trap 'echo -e "${RED}❌ Erreur lors du diagnostic.${NC}"' ERR

# 🚀 Exécution
main "$@"
