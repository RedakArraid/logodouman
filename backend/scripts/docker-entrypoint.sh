#!/bin/sh
set -e

echo "🐳 LogoDouman Backend - Démarrage Docker"
echo "======================================="

# Fonction pour attendre un service
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    
    echo "⏳ Attente de $service_name ($host:$port)..."
    
    local timeout=60
    local count=0
    
    while ! nc -z "$host" "$port"; do
        count=$((count + 1))
        if [ $count -gt $timeout ]; then
            echo "❌ Timeout: $service_name n'est pas accessible après ${timeout}s"
            exit 1
        fi
        echo "   ... tentative $count/$timeout"
        sleep 1
    done
    
    echo "✅ $service_name est prêt !"
}

# Attendre PostgreSQL
wait_for_service "postgres" "5432" "PostgreSQL"

# Attendre Redis
wait_for_service "redis" "6379" "Redis"

# Vérifier les variables d'environnement critiques
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erreur: DATABASE_URL n'est pas défini"
    exit 1
fi

echo "🔧 Configuration Prisma..."

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

# Attendre un peu plus pour être sûr que PostgreSQL est vraiment prêt
echo "⏳ Attente supplémentaire pour PostgreSQL..."
sleep 10

# Synchroniser la base de données
echo "📊 Synchronisation de la base de données..."
npx prisma db push --force-reset --accept-data-loss --skip-generate

# Exécuter la migration des données
echo "📦 Migration des données de test..."
if [ -f "scripts/migrate.js" ]; then
    node scripts/migrate.js
    echo "✅ Migration des données terminée"
else
    echo "⚠️ Fichier de migration non trouvé"
fi

echo "🎉 Configuration terminée - Démarrage de l'application..."
echo ""

# Démarrer l'application
exec "$@"
