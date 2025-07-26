#!/bin/bash

echo "🔐 Test de connexion complète"
echo "============================="

echo "1️⃣ Test de l'API de connexion..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@logodouman.com","password":"admin123"}')

echo "📊 Réponse de l'API:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extraire le token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Token obtenu avec succès"
    
    echo ""
    echo "2️⃣ Test de vérification du token..."
    VERIFY_RESPONSE=$(curl -s -X GET http://localhost:4002/api/auth/verify \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📊 Réponse de vérification:"
    echo "$VERIFY_RESPONSE" | jq . 2>/dev/null || echo "$VERIFY_RESPONSE"
    
    echo ""
    echo "3️⃣ Test d'accès au dashboard..."
    DASHBOARD_RESPONSE=$(curl -s -X GET http://localhost:4002/api/dashboard/overview \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📊 Réponse du dashboard:"
    echo "$DASHBOARD_RESPONSE" | jq . 2>/dev/null || echo "$DASHBOARD_RESPONSE"
    
    echo ""
    echo "4️⃣ Test de la page admin..."
    ADMIN_PAGE=$(curl -s http://localhost:3000/admin)
    if echo "$ADMIN_PAGE" | grep -q "LogoDouman"; then
        echo "✅ Page admin accessible"
    else
        echo "❌ Page admin non accessible"
    fi
    
else
    echo "❌ Échec de l'obtention du token"
fi

echo ""
echo "✅ Test de connexion terminé" 