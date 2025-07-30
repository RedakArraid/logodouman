#!/bin/bash

echo "🧡 Test du système d'upload d'images LogoDouman"
echo "================================================"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

echo ""
echo "📂 Vérification des fichiers essentiels..."

# Vérifier les composants frontend
test -f "frontend/app/components/ImageUpload.tsx"
check_result "Composant ImageUpload.tsx"

test -f "frontend/app/admin/components/ProductForm.tsx"
check_result "Formulaire ProductForm.tsx"

test -f "frontend/app/admin/components/CategoryForm.tsx"
check_result "Formulaire CategoryForm.tsx"

test -f "frontend/app/config/api.ts"
check_result "Configuration API"

test -f "frontend/.env.local"
check_result "Variables d'environnement"

test -f "frontend/app/test-upload-simple/page.tsx"
check_result "Page de test d'upload"

echo ""
echo "🔧 Vérification de la configuration..."

# Vérifier la variable d'environnement
if grep -q "NEXT_PUBLIC_API_URL" frontend/.env.local; then
    echo -e "${GREEN}✅ NEXT_PUBLIC_API_URL configuré${NC}"
else
    echo -e "${RED}❌ NEXT_PUBLIC_API_URL manquant${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:4002" >> frontend/.env.local
    echo -e "${YELLOW}🔧 Variable ajoutée automatiquement${NC}"
fi

echo ""
echo "📦 Vérification des dépendances..."

# Vérifier que node_modules existe
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Dépendances frontend installées${NC}"
else
    echo -e "${RED}❌ Dépendances frontend manquantes${NC}"
    echo -e "${YELLOW}💡 Exécutez: cd frontend && npm install${NC}"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Dépendances backend installées${NC}"
else
    echo -e "${RED}❌ Dépendances backend manquantes${NC}"
    echo -e "${YELLOW}💡 Exécutez: cd backend && npm install${NC}"
fi

echo ""
echo "🚀 Instructions pour tester l'upload d'images:"
echo ""
echo "1. Démarrer le projet:"
echo -e "${YELLOW}   npm run dev${NC}"
echo ""
echo "2. Tester la sélection de fichiers:"
echo -e "${YELLOW}   http://localhost:3000/test-upload-simple${NC}"
echo ""
echo "3. Tester l'interface admin complète:"
echo -e "${YELLOW}   http://localhost:3000/admin/login${NC}"
echo "   📧 Email: admin@logodouman.com"
echo "   🔑 Mot de passe: admin123"
echo ""
echo "4. Dans l'admin:"
echo "   • Aller dans 'Produits' > 'Ajouter un produit'"
echo "   • Chercher la section 'Image du produit'"
echo "   • Vous devriez voir un bouton '📁 Parcourir'"
echo ""

# Vérifier si les processus sont déjà en cours
if pgrep -f "next dev" > /dev/null; then
    echo -e "${GREEN}✅ Frontend déjà en cours d'exécution${NC}"
else
    echo -e "${YELLOW}💡 Frontend non démarré - lancez 'npm run dev'${NC}"
fi

if pgrep -f "node.*app.js" > /dev/null; then
    echo -e "${GREEN}✅ Backend déjà en cours d'exécution${NC}"
else
    echo -e "${YELLOW}💡 Backend non démarré - lancez 'npm run dev'${NC}"
fi

echo ""
echo "🎯 Si le bouton 'Parcourir' n'apparaît toujours pas:"
echo "1. Ouvrez la console du navigateur (F12)"
echo "2. Cherchez les erreurs en rouge"
echo "3. Vérifiez que l'authentification admin fonctionne"
echo "4. Testez d'abord la page simple: /test-upload-simple"
echo ""
echo -e "${GREEN}🎉 Configuration terminée ! Le bouton d'upload devrait maintenant être visible.${NC}"
