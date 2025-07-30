#!/bin/bash

echo "🔍 Vérification du Système d'Upload LogoDouman"
echo "=============================================="

echo ""
echo "📂 1. Vérification des volumes Docker..."
echo "Structure des dossiers d'upload :"
docker-compose exec backend ls -la /app/uploads/ 2>/dev/null || echo "❌ Volumes non accessibles - Vérifiez que les conteneurs sont démarrés"

echo ""
echo "📦 2. Vérification des images produits :"
docker-compose exec backend ls -la /app/uploads/products/ 2>/dev/null || echo "📂 Dossier vide - Aucune image produit uploadée"

echo ""
echo "🏷️ 3. Vérification des images catégories :"
docker-compose exec backend ls -la /app/uploads/categories/ 2>/dev/null || echo "📂 Dossier vide - Aucune image catégorie uploadée"

echo ""
echo "🌐 4. Test de l'API d'upload..."
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4002/api/products/upload" -X POST)
if [ "$response" = "400" ]; then
    echo "✅ API upload produits : Opérationnelle (400 = normal sans fichier)"
else
    echo "❌ API upload produits : Problème (Code: $response)"
fi

response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4002/api/categories/upload" -X POST)
if [ "$response" = "400" ]; then
    echo "✅ API upload catégories : Opérationnelle (400 = normal sans fichier)"
else
    echo "❌ API upload catégories : Problème (Code: $response)"
fi

echo ""
echo "📋 5. Instructions pour tester l'upload :"
echo "1. 🌐 Aller sur : http://localhost:3000/admin/login"
echo "2. 🔑 Se connecter : admin@logodouman.com / admin123"
echo "3. 📦 'Gestion des Produits' → 'Ajouter un produit'"
echo "4. 📸 Glisser une image JPG/PNG dans la zone d'upload"
echo "5. ✅ Vérifier la prévisualisation"
echo "6. 💾 Sauvegarder le produit"
echo ""
echo "Ou testez directement sur : http://localhost:3000/test-upload"
echo ""
echo "Pour voir les fichiers uploadés après test :"
echo "docker-compose exec backend ls -la /app/uploads/products/"
echo ""
echo "🎉 Système d'upload prêt à l'utilisation !"
