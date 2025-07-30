#!/bin/bash

echo "🚀 Initialisation des dossiers d'upload LogoDouman..."

# Créer les dossiers d'upload avec les bonnes permissions
mkdir -p /app/uploads/products
mkdir -p /app/uploads/categories
mkdir -p /app/uploads/temp

# Définir les permissions
chmod 755 /app/uploads
chmod 755 /app/uploads/products
chmod 755 /app/uploads/categories
chmod 755 /app/uploads/temp

# Créer un fichier .gitkeep pour maintenir les dossiers dans git
touch /app/uploads/.gitkeep
touch /app/uploads/products/.gitkeep
touch /app/uploads/categories/.gitkeep

echo "✅ Dossiers d'upload initialisés avec succès !"
echo "📁 Structure créée :"
echo "   /app/uploads/"
echo "   ├── products/"
echo "   ├── categories/"
echo "   └── temp/"

# Afficher les permissions
ls -la /app/uploads/
