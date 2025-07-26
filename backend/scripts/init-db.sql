-- 🗄️ Script d'initialisation PostgreSQL pour LogoDouman
-- Ce script s'exécute automatiquement lors de la création du conteneur

-- Créer la base de données si elle n'existe pas
SELECT 'CREATE DATABASE logodouman'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'logodouman')\gexec

-- Se connecter à la base de données logodouman
\c logodouman;

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurer la base de données pour les performances
ALTER DATABASE logodouman SET timezone TO 'UTC';

-- Logs de débogage
\echo '✅ Base de données LogoDouman initialisée avec succès'
\echo '📦 Extensions UUID et pg_trgm installées'
\echo '🕐 Timezone configuré sur UTC'
