# Dockerfile pour le frontend Next.js avec corrections
FROM node:18-alpine AS base

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./
COPY types/ ./types/

# Installation des dépendances
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Builder étape
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copier le fichier d'environnement Docker
COPY .env.docker .env.local

# Build de l'application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copier le fichier d'environnement
COPY .env.docker .env.local

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
