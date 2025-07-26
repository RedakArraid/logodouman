#!/bin/bash

# 🔧 Script pour rendre tous les scripts exécutables
# LogoDouman - Configuration finale

echo "🔧 Configuration des permissions pour LogoDouman..."

# Scripts principaux
chmod +x start-complete.sh
chmod +x diagnostic.sh

# Scripts backend
chmod +x backend/scripts/docker-entrypoint.sh

# Vérification
echo "✅ Permissions configurées :"
ls -la *.sh
ls -la backend/scripts/*.sh

echo "🎉 Tous les scripts sont maintenant exécutables !"
echo ""
echo "🚀 Vous pouvez maintenant lancer :"
echo "   ./start-complete.sh"
