#!/bin/bash

echo "🔧 LogoDouman - Test et Redémarrage Rapide"
echo "==========================================="

# 1. Tester la connectivité backend
echo "🧪 Test de connectivité backend..."
if curl -s -f http://localhost:4002/health > /dev/null 2>&1; then
    echo "✅ Backend accessible"
    
    # 2. Test authentification
    echo "🔐 Test authentification admin..."
    AUTH_RESPONSE=$(curl -s -X POST http://localhost:4002/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@logodouman.com","password":"admin123"}' 2>/dev/null)
    
    if echo "$AUTH_RESPONSE" | grep -q "token"; then
        echo "✅ Authentification réussie"
        echo "🎉 Backend fonctionnel - Pas besoin de redémarrage"
        exit 0
    else
        echo "❌ Authentification échouée - Migration nécessaire"
    fi
else
    echo "❌ Backend inaccessible - Redémarrage nécessaire"
fi

# 3. Redémarrage rapide
echo ""
echo "🔄 Redémarrage des services nécessaires..."

# Redémarrer le backend seulement
echo "⚙️ Redémarrage du backend..."
docker-compose restart backend

# Attendre que le backend soit prêt
echo "⏳ Attente du backend (60 secondes)..."
sleep 60

# Test de l'état du backend
echo "🔍 Vérification de l'état du backend..."
if docker-compose ps backend | grep -q "healthy"; then
    echo "✅ Backend redémarré avec succès"
    
    # Forcer la migration si nécessaire
    echo "📊 Vérification/Exécution de la migration..."
    docker-compose exec backend npm run migrate
    
    echo ""
    echo "🎉 Redémarrage rapide terminé !"
    echo "🌐 Testez maintenant : http://localhost:3000/admin/login"
    echo "🔐 admin@logodouman.com / admin123"
else
    echo "❌ Problème avec le backend - Redémarrage complet recommandé"
    echo "💡 Exécutez: ./start-complete.sh"
fi
