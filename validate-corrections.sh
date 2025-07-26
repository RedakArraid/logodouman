#!/bin/bash

# Script de validation des corrections LogoDouman
echo "🔍 Validation des corrections LogoDouman..."

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $2${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

echo -e "${BLUE}📋 Vérification des corrections critiques...${NC}"

# 1. Vérifier que le fichier defaults.ts existe
echo -e "${YELLOW}1. Vérification du fichier defaults.ts...${NC}"
if [ -f "frontend/data/defaults.ts" ]; then
    check_result 0 "Fichier defaults.ts créé"
else
    check_result 1 "Fichier defaults.ts manquant"
fi

# 2. Vérifier les IDs des catégories dans defaults.ts
echo -e "${YELLOW}2. Vérification des IDs de catégories...${NC}"
if grep -q "cat-001-luxury" frontend/data/defaults.ts && \
   grep -q "cat-002-vintage" frontend/data/defaults.ts && \
   grep -q "cat-003-business" frontend/data/defaults.ts && \
   grep -q "cat-004-casual" frontend/data/defaults.ts; then
    check_result 0 "IDs des catégories cohérents"
else
    check_result 1 "IDs des catégories incohérents"
fi

# 3. Vérifier les prix en centimes
echo -e "${YELLOW}3. Vérification des prix en centimes...${NC}"
if grep -q "1500000.*150.00€" frontend/data/defaults.ts && \
   grep -q "1250000.*125.00€" frontend/data/defaults.ts; then
    check_result 0 "Prix en centimes cohérents"
else
    check_result 1 "Prix en centimes incohérents"
fi

# 4. Vérifier les imports dans StoreContext
echo -e "${YELLOW}4. Vérification des imports StoreContext...${NC}"
if grep -q "import.*DEFAULT_PRODUCTS.*DEFAULT_CATEGORIES.*defaults" frontend/app/contexts/StoreContext.tsx; then
    check_result 0 "Imports StoreContext corrects"
else
    check_result 1 "Imports StoreContext incorrects"
fi

# 5. Vérifier les IDs dans le script de migration
echo -e "${YELLOW}5. Vérification du script de migration...${NC}"
if grep -q "cat-001-luxury" backend/scripts/migrate.js && \
   grep -q "cat-002-vintage" backend/scripts/migrate.js && \
   grep -q "cat-003-business" backend/scripts/migrate.js && \
   grep -q "cat-004-casual" backend/scripts/migrate.js; then
    check_result 0 "Script de migration mis à jour"
else
    check_result 1 "Script de migration non mis à jour"
fi

# 6. Vérifier les fonctions de validation des prix
echo -e "${YELLOW}6. Vérification des fonctions de prix...${NC}"
if grep -q "validatePrice" frontend/types/index.ts && \
   grep -q "formatPrice" frontend/types/index.ts; then
    check_result 0 "Fonctions de prix présentes"
else
    check_result 1 "Fonctions de prix manquantes"
fi

# 7. Vérifier les images uniques
echo -e "${YELLOW}7. Vérification des images uniques...${NC}"
if grep -q "photo-1578662996442" frontend/data/defaults.ts; then
    check_result 0 "Images uniques configurées"
else
    check_result 1 "Images non uniques"
fi

# 8. Vérifier la documentation mise à jour
echo -e "${YELLOW}8. Vérification de la documentation...${NC}"
if grep -q "4 produits" README.md && \
   grep -q "admin@logodouman.com" README.md; then
    check_result 0 "Documentation mise à jour"
else
    check_result 1 "Documentation non mise à jour"
fi

# 9. Vérifier les champs coating ajoutés
echo -e "${YELLOW}9. Vérification des champs coating...${NC}"
if grep -q "coating.*Vernis brillant" backend/scripts/migrate.js; then
    check_result 0 "Champs coating ajoutés"
else
    check_result 1 "Champs coating manquants"
fi

# 10. Vérifier la cohérence API
echo -e "${YELLOW}10. Vérification de l'API config...${NC}"
if grep -q "import.*DEFAULT_PRODUCTS.*DEFAULT_CATEGORIES" frontend/app/config/api.ts; then
    check_result 0 "API config mise à jour"
else
    check_result 1 "API config non mise à jour"
fi

# Résumé final
echo -e "\n${BLUE}📊 Résumé de la validation :${NC}"
echo -e "Total des vérifications : $TOTAL_CHECKS"
echo -e "${GREEN}Réussies : $PASSED_CHECKS${NC}"
echo -e "${RED}Échouées : $FAILED_CHECKS${NC}"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Toutes les corrections ont été appliquées avec succès !${NC}"
    echo -e "${GREEN}✅ Le projet LogoDouman est maintenant cohérent.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  $FAILED_CHECKS correction(s) restante(s) à appliquer.${NC}"
    echo -e "${YELLOW}📝 Consultez les détails ci-dessus pour corriger les problèmes.${NC}"
    exit 1
fi
