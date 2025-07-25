#!/bin/sh
set -e

echo "🚀 LogoDouman Backend - Docker Entrypoint"

# Installer netcat pour les tests de connexion
apk add --no-cache netcat-openbsd

# Fonction pour attendre que PostgreSQL soit prêt
wait_for_postgres() {
  echo "⏳ Attente de PostgreSQL..."
  
  while ! nc -z postgres 5432; do
    echo "PostgreSQL n'est pas encore prêt, attente 2 secondes..."
    sleep 2
  done
  
  echo "✅ PostgreSQL est prêt !"
}

# Fonction pour attendre que Redis soit prêt (optionnel)
wait_for_redis() {
  echo "⏳ Attente de Redis..."
  
  while ! nc -z redis 6379; do
    echo "Redis n'est pas encore prêt, attente 1 seconde..."
    sleep 1
  done
  
  echo "✅ Redis est prêt !"
}

# Attendre les services essentiels
wait_for_postgres
wait_for_redis || echo "⚠️ Redis optionnel non disponible"

# Vérifier si la base de données existe et est accessible
echo "🔍 Vérification de la base de données..."
npx prisma db push --accept-data-loss || {
  echo "❌ Erreur lors de la synchronisation de la base de données"
  exit 1
}

# Exécuter les migrations si nécessaire
echo "📦 Exécution des migrations..."
if [ -f "scripts/migrate.js" ]; then
  node scripts/migrate.js || {
    echo "⚠️ Avertissement: Les migrations ont échoué, mais le serveur va démarrer"
  }
else
  echo "ℹ️ Aucun script de migration trouvé"
fi

echo "🎉 Initialisation terminée, démarrage du serveur..."

# Exécuter la commande principale
exec "$@"
