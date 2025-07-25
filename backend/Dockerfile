# Dockerfile pour le backend Node.js/Express avec corrections
FROM node:18-alpine

# Installer les dépendances système
RUN apk add --no-cache openssl curl

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le schéma Prisma et générer le client
COPY prisma ./prisma
RUN npx prisma generate

# Copier le reste de l'application
COPY . .

# Copier le fichier d'environnement Docker
COPY .env.docker .env

# Créer les dossiers nécessaires
RUN mkdir -p /app/uploads /app/logs
RUN chown -R node:node /app

# Utiliser l'utilisateur non-root
USER node

EXPOSE 4002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4002/health || exit 1

# Script de démarrage avec attente de la DB
COPY --chown=node:node scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
