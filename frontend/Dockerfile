# 🌐 Dockerfile Frontend Next.js - Version Corrigée Optimisée
FROM node:18-alpine AS base

# 📦 Installation des dépendances système
RUN apk add --no-cache libc6-compat wget curl

WORKDIR /app

# 📋 Étape 1: Installation des dépendances
FROM base AS deps

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installation complète (dev + prod) pour le build
RUN npm ci --include=dev && npm cache clean --force

# 🏗️ Étape 2: Build de l'application
FROM base AS builder

WORKDIR /app

# Copier les dépendances installées
COPY --from=deps /app/node_modules ./node_modules

# Copier tout le code source
COPY . .

# Variables de build
ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=http://localhost:4002
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# 🏗️ Build de l'application Next.js
RUN npm run build

# 🚀 Étape 3: Production - Image finale
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 👤 Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 📁 Copier les fichiers publics
COPY --from=builder /app/public ./public

# 📁 Créer le dossier .next avec les bonnes permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 📦 Copier les fichiers de production
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 📄 Copier les fichiers de configuration si présents
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js* ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# 👤 Utiliser l'utilisateur non-root
USER nextjs

# 🔍 Health check optimisé
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# 🚀 Exposer le port
EXPOSE 3000

# 🎯 Commande de démarrage
CMD ["node", "server.js"]
