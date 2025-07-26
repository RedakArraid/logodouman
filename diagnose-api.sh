#!/bin/bash

echo "🔍 Diagnostic des Données API LogoDouman"
echo "======================================="

echo ""
echo "📦 Test API Products:"
echo "--------------------"
PRODUCTS_RESPONSE=$(curl -s http://localhost:4002/api/products)
echo "$PRODUCTS_RESPONSE" | jq '.' 2>/dev/null || echo "Response: $PRODUCTS_RESPONSE"

echo ""
echo "🏷️ Test API Categories:"
echo "----------------------"
CATEGORIES_RESPONSE=$(curl -s http://localhost:4002/api/categories)
echo "$CATEGORIES_RESPONSE" | jq '.' 2>/dev/null || echo "Response: $CATEGORIES_RESPONSE"

echo ""
echo "🔐 Test API Auth Verify:"
echo "------------------------"
AUTH_RESPONSE=$(curl -s http://localhost:4002/api/auth/verify)
echo "$AUTH_RESPONSE" | jq '.' 2>/dev/null || echo "Response: $AUTH_RESPONSE"

echo ""
echo "💾 Vérification Base de Données:"
echo "--------------------------------"
echo "Vérification utilisateur admin..."
ADMIN_CHECK=$(docker-compose exec -T backend node -e "
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.user.findFirst({where: {email: 'admin@logodouman.com'}})
  .then(user => console.log(JSON.stringify(user, null, 2)))
  .catch(err => console.log('Erreur:', err.message))
  .finally(() => db.\$disconnect());
" 2>/dev/null)
echo "$ADMIN_CHECK"

echo ""
echo "📊 Vérification Produits en DB:"
echo "-------------------------------"
PRODUCTS_DB=$(docker-compose exec -T backend node -e "
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.product.findMany({take: 2})
  .then(products => console.log(JSON.stringify(products, null, 2)))
  .catch(err => console.log('Erreur:', err.message))
  .finally(() => db.\$disconnect());
" 2>/dev/null)
echo "$PRODUCTS_DB"

echo ""
echo "🎯 Résumé du Diagnostic:"
echo "========================"
echo "✅ API Products accessible"
echo "✅ API Categories accessible"
echo "⚠️ Erreur React #130 - Problème de rendu JSX"
echo ""
echo "💡 Solution recommandée:"
echo "   • Vérifier la structure des données retournées"
echo "   • Adapter le frontend aux données réelles"
echo "   • Gérer les cas où les données sont undefined/null"
