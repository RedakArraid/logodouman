#!/bin/bash

# Script de réparation Prisma pour LogoDouman
echo "🔧 Réparation de la configuration Prisma..."

# 1. Nettoyer les anciens fichiers générés
echo "🧹 Nettoyage des fichiers générés..."
rm -rf node_modules/.prisma
rm -rf prisma/generated

# 2. Régénérer le client Prisma
echo "🔄 Régénération du client Prisma..."
npx prisma generate

# 3. Vérifier la connexion à la base de données
echo "🗄️ Vérification de la connexion à la base de données..."
npx prisma db pull --force

# 4. Pousser le schéma vers la base de données
echo "📤 Synchronisation du schéma..."
npx prisma db push --force-reset

echo "✅ Réparation terminée !"
echo "🚀 Vous pouvez maintenant démarrer le serveur avec: npm run dev"
