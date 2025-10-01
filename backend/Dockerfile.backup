# 🔧 Dockerfile Backend Node.js - Version Corrigée Optimisée
FROM node:18-alpine AS base

# 📦 Installation des dépendances système nécessaires
RUN apk add --no-cache \
    openssl \
    wget \
    curl \
    netcat-openbsd \
    postgresql-client \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# 📋 Étape 1: Installation des dépendances
FROM base AS deps

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installation des dépendances de production et dev (pour Prisma)
RUN npm ci --include=dev && npm cache clean --force

# 🏗️ Étape 2: Build et préparation
FROM base AS builder

WORKDIR /app

# Copier les dépendances installées
COPY --from=deps /app/node_modules ./node_modules

# Copier le schéma Prisma en premier (pour le cache Docker)
COPY prisma ./prisma

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code source
COPY . .

# Installer uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# 🚀 Étape 3: Production - Image finale
FROM base AS runner

WORKDIR /app

# Variables d'environnement de production
ENV NODE_ENV=production
ENV PORT=4002

# 👤 Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs nodejs

# 📦 Copier les dépendances de production
COPY --from=builder /app/node_modules ./node_modules

# 📦 Copier le client Prisma généré
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 📁 Copier le code source et la configuration
COPY --chown=nodejs:nodejs . .

# 📁 Créer les dossiers nécessaires avec les bonnes permissions
RUN mkdir -p /app/uploads /app/logs /app/tmp && \
    chown -R nodejs:nodejs /app/uploads /app/logs /app/tmp

# 🔧 Rendre les scripts exécutables
RUN chmod +x /app/scripts/*.sh

# 👤 Utiliser l'utilisateur non-root
USER nodejs

# 🔍 Health check optimisé
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4002/health || exit 1

# 🚀 Exposer le port
EXPOSE 4002

# 🎯 Point d'entrée et commande de démarrage
ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["npm", "start"]
