#!/bin/bash

echo "🚀 LogoDouman - Script de Démarrage Complet"
echo "============================================"

# Fonction pour vérifier l'état d'un service
check_service() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep "$service" | grep -q "healthy\|running"; then
            echo "✅ $service est prêt"
            return 0
        fi
        echo "⏳ Attente de $service (tentative $attempt/$max_attempts)..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Timeout pour $service"
    return 1
}

# 1. Nettoyer l'environnement
echo "🧹 Nettoyage de l'environnement..."
docker-compose down -v
docker system prune -f

# 2. Construire les images
echo "🔨 Construction des images Docker..."
docker-compose build --no-cache

# 3. Démarrer PostgreSQL
echo "🗄️ Démarrage de PostgreSQL..."
docker-compose up postgres -d
check_service "postgres"

# 4. Démarrer Redis
echo "🔄 Démarrage de Redis..."
docker-compose up redis -d
check_service "redis"

# 5. Démarrer le Backend
echo "⚙️ Démarrage du Backend..."
docker-compose up backend -d
echo "⏳ Attente de l'initialisation du backend (90 secondes)..."
sleep 90
check_service "backend"

# 6. Vérifier que la migration a eu lieu
echo "📊 Vérification de la migration..."
docker-compose exec backend node -e "
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.user.findFirst().then(user => {
  if (user) {
    console.log('✅ Migration réussie - Utilisateur admin trouvé');
  } else {
    console.log('⚠️ Pas d\\'utilisateur trouvé - Exécution de la migration...');
    process.exit(1);
  }
}).catch(() => {
  console.log('⚠️ Erreur de connexion DB - Relancement migration...');
  process.exit(1);
}).finally(() => db.\$disconnect());
" || docker-compose exec backend npm run migrate

# 7. Démarrer le Frontend
echo "🎨 Démarrage du Frontend..."
docker-compose up frontend -d
check_service "frontend"

# 8. Démarrer Adminer
echo "🔧 Démarrage d'Adminer..."
docker-compose up adminer -d

# 9. Vérification finale
echo ""
echo "🎉 Démarrage terminé !"
echo ""
echo "📊 État des services :"
docker-compose ps

echo ""
echo "🌐 Accès aux services :"
echo "   • Site principal : http://localhost:3000"
echo "   • Administration : http://localhost:3000/admin/login"
echo "   • API Backend    : http://localhost:4002"
echo "   • Adminer (DB)   : http://localhost:8080"
echo ""
echo "🔐 Identifiants Admin :"
echo "   • Email     : admin@logodouman.com"
echo "   • Password  : admin123"
echo ""
echo "🧪 Tests rapides :"
echo "   • curl http://localhost:4002/health"
echo "   • curl http://localhost:3000"
echo ""
echo "📋 Logs en temps réel :"
echo "   • docker-compose logs -f"
echo "   • docker-compose logs -f backend"
echo "   • docker-compose logs -f frontend"
echo ""
echo "🚀 LogoDouman est maintenant opérationnel !"
echo ""
