#!/bin/bash

echo "🔍 LogoDouman - Diagnostic Complet"
echo "=================================="

# Fonction pour tester un endpoint
test_endpoint() {
    local url=$1
    local name=$2
    echo -n "🧪 Test $name ($url): "
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ ÉCHEC"
        return 1
    fi
}

# 1. État des services Docker
echo ""
echo "📊 État des services Docker:"
docker-compose ps

# 2. Test de connectivité réseau
echo ""
echo "🌐 Test de connectivité:"
test_endpoint "http://localhost:4002/health" "Backend Health"
test_endpoint "http://localhost:4002/api/test" "Backend API"
test_endpoint "http://localhost:3000" "Frontend"

# 3. Test authentification
echo ""
echo "🔐 Test authentification admin:"
echo -n "🧪 Login admin: "
AUTH_RESPONSE=$(curl -s -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@logodouman.com","password":"admin123"}' 2>/dev/null)

if echo "$AUTH_RESPONSE" | grep -q "token"; then
    echo "✅ OK"
    TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    # Test avec le token
    echo -n "🧪 Vérification token: "
    if curl -s -f "http://localhost:4002/api/auth/verify" \
       -H "Authorization: Bearer $TOKEN" > /dev/null 2>&1; then
        echo "✅ OK"
    else
        echo "❌ ÉCHEC"
    fi
else
    echo "❌ ÉCHEC"
    echo "   Response: $AUTH_RESPONSE"
fi

# 4. Test base de données
echo ""
echo "🗄️ Test base de données:"
echo -n "🧪 Connexion PostgreSQL: "
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ OK"
    
    echo -n "🧪 Données admin présentes: "
    ADMIN_CHECK=$(docker-compose exec -T backend node -e "
        const { PrismaClient } = require('@prisma/client');
        const db = new PrismaClient();
        db.user.findFirst({where: {email: 'admin@logodouman.com'}})
          .then(user => console.log(user ? 'found' : 'not_found'))
          .catch(() => console.log('error'))
          .finally(() => db.\$disconnect());
    " 2>/dev/null)
    
    if echo "$ADMIN_CHECK" | grep -q "found"; then
        echo "✅ OK"
    else
        echo "❌ ÉCHEC - Admin non trouvé"
    fi
else
    echo "❌ ÉCHEC"
fi

# 5. Test Redis
echo ""
echo "🔄 Test Redis:"
echo -n "🧪 Connexion Redis: "
if docker-compose exec -T redis redis-cli -a redis123 ping > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ ÉCHEC"
fi

# 6. Logs récents des erreurs
echo ""
echo "📋 Logs récents (erreurs):"
echo "--- Backend ---"
docker-compose logs --tail=5 backend | grep -i error || echo "Aucune erreur récente"

echo ""
echo "--- Frontend ---"
docker-compose logs --tail=5 frontend | grep -i error || echo "Aucune erreur récente"

# 7. Utilisation des ressources
echo ""
echo "💻 Utilisation des ressources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" \
  logodouman-postgres logodouman-redis logodouman-backend logodouman-frontend 2>/dev/null || \
  echo "Impossible de récupérer les statistiques"

# 8. Ports utilisés
echo ""
echo "🔌 Ports utilisés:"
netstat -tlnp 2>/dev/null | grep -E ":(3000|4002|55432|6379|8080)" || \
  lsof -i -P -n | grep -E ":(3000|4002|55432|6379|8080)" || \
  echo "Impossible de vérifier les ports"

# 9. Résumé et recommandations
echo ""
echo "📋 Résumé du diagnostic:"
echo "========================"

# Compter les services en cours
RUNNING_SERVICES=$(docker-compose ps | grep -c "Up")
TOTAL_SERVICES=5

if [ "$RUNNING_SERVICES" -eq "$TOTAL_SERVICES" ]; then
    echo "✅ Tous les services sont en cours d'exécution ($RUNNING_SERVICES/$TOTAL_SERVICES)"
else
    echo "⚠️ Certains services ne fonctionnent pas ($RUNNING_SERVICES/$TOTAL_SERVICES)"
fi

echo ""
echo "🎯 Actions recommandées:"
if [ "$RUNNING_SERVICES" -lt "$TOTAL_SERVICES" ]; then
    echo "   • Redémarrer les services: docker-compose restart"
    echo "   • Voir les logs: docker-compose logs -f"
fi

echo "   • Accéder au site: http://localhost:3000"
echo "   • Accéder à l'admin: http://localhost:3000/admin/login"
echo "   • Identifiants: admin@logodouman.com / admin123"
echo ""
