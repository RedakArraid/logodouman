#!/bin/bash

echo "🧪 Tests du Système d'Upload d'Images LogoDouman"
echo "================================================="

# Variables
API_URL="http://localhost:4002"
FRONTEND_URL="http://localhost:3000"

echo ""
echo "🔍 1. Vérification des services..."

# Test Backend
echo "📡 Test Backend API..."
backend_status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" || echo "ERROR")
if [ "$backend_status" = "200" ]; then
    echo "✅ Backend API: OK ($API_URL)"
else
    echo "❌ Backend API: ERREUR (Code: $backend_status)"
fi

# Test Frontend
echo "🌐 Test Frontend..."
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo "ERROR")
if [ "$frontend_status" = "200" ]; then
    echo "✅ Frontend: OK ($FRONTEND_URL)"
else
    echo "❌ Frontend: ERREUR (Code: $frontend_status)"
fi

echo ""
echo "🔍 2. Vérification des dossiers d'upload..."

# Vérifier les dossiers dans le conteneur
echo "📁 Structure des dossiers d'upload:"
docker-compose exec backend ls -la /app/uploads/ 2>/dev/null || echo "❌ Impossible d'accéder aux dossiers d'upload"

echo ""
echo "🔍 3. Test des endpoints d'upload..."

# Test endpoint upload produits (sans fichier - doit échouer gracieusement)
echo "📦 Test endpoint upload produits:"
upload_test=$(curl -s -X POST "$API_URL/api/products/upload" \
  -H "Content-Type: multipart/form-data" \
  -w "%{http_code}" -o /tmp/upload_test.json)

if [ "$upload_test" = "400" ]; then
    echo "✅ Endpoint upload produits: CONFIGURÉ (retourne bien 400 sans fichier)"
else
    echo "❌ Endpoint upload produits: PROBLÈME (Code: $upload_test)"
fi

# Test endpoint upload catégories
echo "🏷️ Test endpoint upload catégories:"
category_upload_test=$(curl -s -X POST "$API_URL/api/categories/upload" \
  -H "Content-Type: multipart/form-data" \
  -w "%{http_code}" -o /tmp/category_upload_test.json)

if [ "$category_upload_test" = "400" ]; then
    echo "✅ Endpoint upload catégories: CONFIGURÉ (retourne bien 400 sans fichier)"
else
    echo "❌ Endpoint upload catégories: PROBLÈME (Code: $category_upload_test)"
fi

echo ""
echo "🔍 4. Test des données par défaut..."

# Test récupération produits
echo "📦 Test récupération produits:"
products_test=$(curl -s "$API_URL/api/products" | jq length 2>/dev/null || echo "0")
echo "✅ Produits trouvés: $products_test"

# Test récupération catégories
echo "🏷️ Test récupération catégories:"
categories_test=$(curl -s "$API_URL/api/categories" | jq length 2>/dev/null || echo "0")
echo "✅ Catégories trouvées: $categories_test"

echo ""
echo "🎯 5. Instructions de test manuel..."
echo ""
echo "Pour tester l'upload d'images complet:"
echo "1. 🌐 Aller sur: $FRONTEND_URL/admin/login"
echo "2. 🔑 Se connecter avec:"
echo "   Email: admin@logodouman.com"
echo "   Mot de passe: admin123"
echo "3. 📦 Aller dans 'Gestion des Produits'"
echo "4. ➕ Cliquer 'Ajouter un produit'"
echo "5. 📸 Glisser une image JPG/PNG dans la zone d'upload"
echo "6. ✅ Vérifier la prévisualisation"
echo "7. 💾 Sauvegarder le produit"
echo ""
echo "🎉 Test du système d'upload terminé !"
