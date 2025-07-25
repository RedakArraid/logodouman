#!/bin/bash

echo "🐳 Script de réparation Docker pour LogoDouman"
echo "=============================================="

# 1. Arrêter tous les services
echo "🛑 Arrêt des services..."
docker-compose down

# 2. Nettoyer les containers et images
echo "🧹 Nettoyage des containers..."
docker-compose down --remove-orphans

# 3. Démarrer PostgreSQL en premier
echo "🗄️ Démarrage de PostgreSQL..."
docker-compose up postgres -d

# 4. Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL (30 secondes)..."
sleep 30

# 5. Vérifier que PostgreSQL est prêt
echo "🔍 Vérification de PostgreSQL..."
docker-compose exec postgres pg_isready -U postgres

# 6. Démarrer Redis
echo "🔄 Démarrage de Redis..."
docker-compose up redis -d
sleep 5

# 7. Construire et démarrer le backend
echo "⚙️ Construction et démarrage du backend..."
docker-compose up backend -d --build

# 8. Attendre que le backend soit prêt
echo "⏳ Attente du backend (20 secondes)..."
sleep 20

# 9. Exécuter les migrations Prisma
echo "📊 Exécution des migrations Prisma..."
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma db push --force-reset
docker-compose exec backend npm run migrate

# 10. Démarrer le frontend
echo "🎨 Démarrage du frontend..."
docker-compose up frontend -d --build

# 11. Démarrer Adminer
echo "🔧 Démarrage d'Adminer..."
docker-compose up adminer -d

# 12. Vérification finale
echo "✅ Vérification des services..."
docker-compose ps

echo ""
echo "🎉 Configuration terminée !"
echo "📱 Frontend: http://localhost:3000"
echo "⚙️ Backend: http://localhost:4002"
echo "🗄️ Adminer: http://localhost:8080"
echo ""
echo "📊 Pour voir les logs:"
echo "docker-compose logs -f"
