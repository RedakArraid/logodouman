# 🚀 LogoDouman - Guide d'Intégration Complète

## ✅ Modifications Effectuées

### 1️⃣ **Backend - Script d'Entrypoint** (`/root/logodouman/backend/scripts/docker-entrypoint.sh`)
- ✅ Détection automatique des noms d'hôtes depuis `DATABASE_URL` et `REDIS_URL`
- ✅ Compatible avec `logodouman-db` et `logodouman-redis` (noms dans docker-compose)
- ✅ Support des noms standards `postgres` et `redis` (pour compatibilité)

### 2️⃣ **Frontend - Dockerfile** (`/root/logodouman/frontend/Dockerfile`)
- ✅ Support du port dynamique (3000 ou 3001)
- ✅ Healthcheck adapté au port configuré
- ✅ Exposition des ports 3000 et 3001

### 3️⃣ **Frontend - Configuration Next.js** (`/root/logodouman/frontend/next.config.js`)
- ✅ Domaines HTTPS ajoutés pour les images :
  - `apilogodouman.genea.space` (HTTPS)
  - `logodouman-backend` (HTTP interne)
- ✅ Configuration CORS mise à jour
- ✅ Support des uploads via HTTPS

### 4️⃣ **Backend - Configuration API** (`/root/logodouman/backend/src/app.js`)
- ✅ CORS multi-origines configuré
- ✅ Support des domaines de production :
  - `https://logodouman.genea.space`
  - `https://apilogodouman.genea.space`
- ✅ Support des ports locaux (3000, 3001)
- ✅ Logs des tentatives CORS non autorisées

---

## 🌐 Architecture Déployée

```
Internet (HTTPS)
    ↓
Traefik (Reverse Proxy + SSL Let's Encrypt)
    ├─→ logodouman.genea.space → logodouman-frontend:3001
    └─→ apilogodouman.genea.space → logodouman-backend:4002
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
logodouman-db:5432  logodouman-redis:6379
(PostgreSQL 16)     (Redis 7)
```

---

## 📋 Configuration DNS Requise

Ajoutez ces enregistrements DNS (remplacez `VOTRE_IP` par votre IP serveur) :

```
logodouman.genea.space     A    VOTRE_IP
apilogodouman.genea.space  A    VOTRE_IP
```

**Vérification DNS :**
```bash
# Depuis votre machine locale
nslookup logodouman.genea.space
nslookup apilogodouman.genea.space
```

---

## 🚀 Commandes de Déploiement

### 1. **Arrêter les services actuels** (optionnel)
```bash
cd /root
docker-compose down
```

### 2. **Construire et démarrer tous les services**
```bash
docker-compose up -d --build
```

### 3. **Vérifier le démarrage des services**
```bash
# Voir l'état de tous les services
docker-compose ps

# Logs en temps réel de LogoDouman
docker-compose logs -f logodouman-backend logodouman-frontend

# Vérifier la santé des conteneurs
docker ps --filter "name=logodouman"
```

### 4. **Attendre la migration de la base de données**
Le backend exécute automatiquement :
- `npx prisma migrate deploy`
- `npx prisma db push`
- `node scripts/migrate.js` (données de test)

**Suivre les logs de migration :**
```bash
docker-compose logs -f logodouman-backend | grep -E "Prisma|migration|Migration"
```

### 5. **Tests de santé**
```bash
# Test backend
curl http://localhost:4002/health

# Test via Traefik (HTTPS)
curl https://apilogodouman.genea.space/health

# Test frontend
curl http://localhost:3001

# Test via Traefik (HTTPS)
curl https://logodouman.genea.space
```

---

## 🔍 Dépannage

### **Problème 1 : Le backend ne démarre pas**
```bash
# Voir les logs détaillés
docker-compose logs logodouman-backend

# Vérifier que PostgreSQL est prêt
docker-compose exec logodouman-db pg_isready -U postgres -d logodouman

# Redémarrer le backend uniquement
docker-compose restart logodouman-backend
```

### **Problème 2 : Erreur de migration Prisma**
```bash
# Se connecter au conteneur backend
docker-compose exec logodouman-backend sh

# Réinitialiser la base de données
npx prisma db push --force-reset --accept-data-loss

# Réexécuter les migrations
npx prisma migrate deploy
node scripts/migrate.js
exit
```

### **Problème 3 : CORS bloqué**
```bash
# Vérifier les logs CORS
docker-compose logs logodouman-backend | grep CORS

# L'origine devrait être dans la liste autorisée
# Si ce n'est pas le cas, vérifier la variable CORS_ORIGIN dans docker-compose.yml
```

### **Problème 4 : Certificat SSL non généré**
```bash
# Vérifier les logs Traefik
docker-compose logs traefik | grep -E "error|certificate|acme"

# Vérifier que les DNS pointent vers votre serveur
nslookup logodouman.genea.space

# Vérifier les ports 80/443 ouverts
netstat -tulpn | grep -E ":80|:443"
```

### **Problème 5 : Le frontend ne se connecte pas au backend**
```bash
# Vérifier les variables d'environnement du frontend
docker-compose exec logodouman-frontend env | grep API

# Devrait afficher :
# NEXT_PUBLIC_API_URL=https://apilogodouman.genea.space
# INTERNAL_API_URL=http://logodouman-backend:4002

# Tester la connexion interne
docker-compose exec logodouman-frontend wget -O- http://logodouman-backend:4002/health
```

---

## 📊 URLs d'Accès

Une fois déployé avec succès :

| Service | URL | Port Local |
|---------|-----|------------|
| **LogoDouman Frontend** | https://logodouman.genea.space | 3001 |
| **LogoDouman API** | https://apilogodouman.genea.space | 4002 |
| **HappyResi Frontend** | https://genea.space | 3000 |
| **HappyResi API** | https://apihappyresi.genea.space | 8000 |
| **n8n** | https://${SUBDOMAIN}.${DOMAIN_NAME} | 5678 |

---

## 🗄️ Gestion des Bases de Données

### **LogoDouman Database**
```bash
# Se connecter à PostgreSQL
docker-compose exec logodouman-db psql -U postgres -d logodouman

# Lister les tables
\dt

# Quitter
\q
```

### **Backup de la base LogoDouman**
```bash
# Créer un backup
docker-compose exec logodouman-db pg_dump -U postgres logodouman > logodouman_backup_$(date +%Y%m%d).sql

# Restaurer un backup
cat logodouman_backup_20250101.sql | docker-compose exec -T logodouman-db psql -U postgres -d logodouman
```

---

## 📦 Volumes Créés

Les données persistantes sont stockées dans :
- `logodouman_postgres_data` : Base de données PostgreSQL
- `logodouman_redis_data` : Cache Redis
- `logodouman_backend_uploads` : Fichiers uploadés (images produits, etc.)
- `logodouman_backend_logs` : Logs du backend

**Lister les volumes :**
```bash
docker volume ls | grep logodouman
```

---

## 🔐 Sécurité - Prochaines Étapes

⚠️ **Pour la production, modifiez ces secrets dans `docker-compose.yml` :**

```yaml
# LogoDouman Database
POSTGRES_PASSWORD: "CHANGEZ_MOI_123"  # Ligne 258

# LogoDouman Redis
command: redis-server --requirepass CHANGEZ_MOI_456  # Ligne 276

# LogoDouman Backend
JWT_SECRET: "CHANGEZ_MOI_789"  # Ligne 176
DATABASE_URL: "postgresql://postgres:CHANGEZ_MOI_123@..."  # Ligne 173
REDIS_URL: "redis://:CHANGEZ_MOI_456@..."  # Ligne 174
```

**Après modification, reconstruire :**
```bash
docker-compose down
docker-compose up -d --build
```

---

## 📈 Monitoring

### **Vérifier l'utilisation des ressources**
```bash
# CPU et RAM par conteneur
docker stats --no-stream | grep logodouman

# Espace disque utilisé
docker system df

# Taille des volumes
docker system df -v | grep logodouman
```

### **Logs persistants**
```bash
# Sauvegarder les logs
docker-compose logs logodouman-backend > logodouman_backend_logs.txt
docker-compose logs logodouman-frontend > logodouman_frontend_logs.txt
```

---

## ✅ Checklist de Vérification Finale

- [ ] DNS configurés (A records pour logodouman.genea.space et apilogodouman.genea.space)
- [ ] Services démarrés : `docker-compose ps` (tous "Up")
- [ ] Certificats SSL générés : `docker-compose logs traefik | grep certificate`
- [ ] Backend accessible : `curl https://apilogodouman.genea.space/health`
- [ ] Frontend accessible : `curl https://logodouman.genea.space`
- [ ] Base de données initialisée : `docker-compose exec logodouman-db psql -U postgres -d logodouman -c '\dt'`
- [ ] CORS fonctionnel : Tester depuis le navigateur sur https://logodouman.genea.space
- [ ] Images produits accessibles : Vérifier l'upload depuis l'admin

---

## 🎯 Prochaines Étapes Recommandées

1. **Configurer des backups automatiques**
   ```bash
   # Créer un script de backup journalier
   # /root/backup-logodouman.sh
   ```

2. **Ajouter un monitoring** (Prometheus + Grafana)

3. **Configurer les alertes** (Uptime monitoring)

4. **Optimiser les performances** (Redis cache, CDN pour images)

5. **Configurer les emails SMTP** (si nécessaire pour l'application)

---

## 📞 Support

En cas de problème :
1. Consultez les logs : `docker-compose logs -f logodouman-backend`
2. Vérifiez les healthchecks : `docker ps`
3. Testez la connectivité réseau : `docker-compose exec logodouman-backend ping logodouman-db`

**Date d'intégration :** $(date)
**Version LogoDouman :** 2.1.0
**Version Docker Compose :** 3.7

