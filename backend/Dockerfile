# Dockerfile simplifié pour le backend LogoDouman
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache openssl curl netcat-openbsd

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le schéma Prisma et générer le client
COPY prisma ./prisma

# Copier le reste de l'application
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Créer les dossiers nécessaires
RUN mkdir -p /app/uploads /app/logs
RUN chown -R node:node /app

# Rendre le script d'entrée exécutable
RUN chmod +x /app/scripts/docker-entrypoint.sh

# Utiliser l'utilisateur non-root
USER node

EXPOSE 4002

# Health check simplifié
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:4002/health || exit 1

# Point d'entrée
ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["npm", "start"]
