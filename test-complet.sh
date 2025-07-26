#!/bin/bash

# Test complet du projet LogoDouman après corrections
echo "🧪 Tests complets du projet LogoDouman..."

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
TEST_PASSED=0
TEST_FAILED=0

run_test() {
    echo -e "${YELLOW}🔸 $1...${NC}"
    if eval "$2"; then
        echo -e "${GREEN}✅ $1 : SUCCÈS${NC}"
        TEST_PASSED=$((TEST_PASSED + 1))
    else
        echo -e "${RED}❌ $1 : ÉCHEC${NC}"
        TEST_FAILED=$((TEST_FAILED + 1))
    fi
    echo ""
}

echo -e "${BLUE}🎯 Démarrage des tests LogoDouman...${NC}\n"

# Test 1: Vérification de la structure
run_test "Structure du projet" "[ -d 'frontend' ] && [ -d 'backend' ] && [ -f 'docker-compose.yml' ]"

# Test 2: Vérification du fichier defaults.ts
run_test "Fichier defaults.ts" "[ -f 'frontend/data/defaults.ts' ] && grep -q 'DEFAULT_PRODUCTS' frontend/data/defaults.ts"

# Test 3: Vérification des IDs cohérents
run_test "IDs des catégories" "grep -q 'cat-001-luxury' frontend/data/defaults.ts && grep -q 'cat-004-casual' frontend/data/defaults.ts"

# Test 4: Vérification des prix
run_test "Prix en centimes" "grep -q '1500000.*150.00€' frontend/data/defaults.ts"

# Test 5: Installation des dépendances frontend
run_test "Installation frontend" "cd frontend && npm install --silent"

# Test 6: Installation des dépendances backend
run_test "Installation backend" "cd backend && npm install --silent"

# Test 7: Build du frontend
run_test "Build frontend" "cd frontend && npm run build"

# Test 8: Validation TypeScript
run_test "Types TypeScript" "cd frontend && npm run type-check"

# Test 9: Linting
run_test "Linting frontend" "cd frontend && npm run lint"

# Test 10: Test du script de migration
run_test "Script de migration" "grep -q 'cat-001-luxury' backend/scripts/migrate.js"

echo -e "${BLUE}📊 Résultats des tests :${NC}"
echo -e "${GREEN}✅ Tests réussis : $TEST_PASSED${NC}"
echo -e "${RED}❌ Tests échoués : $TEST_FAILED${NC}"

if [ $TEST_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Tous les tests sont passés ! Le projet est prêt.${NC}"
    echo -e "${BLUE}🚀 Vous pouvez maintenant lancer :${NC}"
    echo -e "   ${YELLOW}npm run docker:up${NC} - Pour démarrer avec Docker"
    echo -e "   ${YELLOW}npm run dev${NC} - Pour le développement local"
    exit 0
else
    echo -e "\n${RED}⚠️ $TEST_FAILED test(s) ont échoué.${NC}"
    echo -e "${YELLOW}📝 Vérifiez les erreurs ci-dessus avant de continuer.${NC}"
    exit 1
fi
