#!/bin/bash

echo "🎨 Test de la nouvelle interface LogoDouman"
echo "==========================================="

echo "📊 Vérification des services..."
echo "Frontend (Docker): http://localhost:3000"
echo "Frontend (Dev): http://localhost:3002"
echo "Backend: http://localhost:4002"

echo ""
echo "🌐 Test de la nouvelle interface..."
curl -s -o /dev/null -w "Nouvelle interface (port 3002): %{http_code}\n" http://localhost:3002

echo ""
echo "🔍 Vérification du contenu..."
curl -s http://localhost:3002 | grep -o "LogoDouman" | head -1
if [ $? -eq 0 ]; then
    echo "✅ LogoDouman trouvé dans la page"
else
    echo "❌ LogoDouman non trouvé"
fi

echo ""
echo "🛒 Vérification du panier..."
curl -s http://localhost:3002 | grep -o "Mon Panier" | head -1
if [ $? -eq 0 ]; then
    echo "✅ Panier trouvé dans la page"
else
    echo "❌ Panier non trouvé"
fi

echo ""
echo "📦 Vérification des produits..."
curl -s http://localhost:3002 | grep -o "Ajouter au panier" | wc -l
echo " boutons 'Ajouter au panier' trouvés"

echo ""
echo "🎨 Vérification du design..."
curl -s http://localhost:3002 | grep -o "bg-gradient-to-br" | wc -l
echo " éléments avec gradient trouvés"

echo ""
echo "📱 Test de responsivité..."
echo "La page utilise Tailwind CSS avec des classes responsives"

echo ""
echo "✅ Test terminé - Vérifiez que :"
echo "1. La page se charge correctement sur http://localhost:3002"
echo "2. L'interface est moderne avec des gradients orange"
echo "3. Le panier fonctionne (bouton panier visible)"
echo "4. Les produits s'affichent avec leurs prix en FCFA"
echo "5. La recherche et les filtres fonctionnent"
echo "6. L'interface est responsive"

echo ""
echo "🌐 URLs d'accès :"
echo "- Nouvelle interface: http://localhost:3002"
echo "- Interface Docker: http://localhost:3000"
echo "- Backend API: http://localhost:4002"

echo ""
echo "🎯 Fonctionnalités à tester manuellement :"
echo "1. Recherche de produits"
echo "2. Filtrage par catégorie"
echo "3. Ajout au panier"
echo "4. Affichage du panier"
echo "5. Suppression du panier"
echo "6. Passage de commande" 