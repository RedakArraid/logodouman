# 🐳 LogoDouman - Guide Docker Compose

## 🚀 **Démarrage Rapide avec Docker**

### **Prérequis**
- Docker 20.0+ 
- Docker Compose 2.0+
- 4 GB RAM disponible
- Ports libres : 3000, 4002, 55432, 6379, 8080

### **Installation en Une Commande**

```bash
# Clone + Setup + Démarrage complet
git clone <votre-repo>
cd logodouman
npm run setup:docker
```

**⏱️ Temps d'installation : ~3-5 minutes selon votre connexion**

### **Accès aux Services**

Une fois démarré, accédez aux interfaces :

- 🌐 **Site Client** : http://localhost:3000
- ⚙️ **Admin** : http://localhost:3000/admin/login  
- 🔌 **API** : http://localhost:4002
- 🗄️ **Adminer** : http://localhost:8080
- 📊 **Health Check** : http://localhost:4002/health

### **Compte Admin par Défaut**
```
Email: admin@logodouman.com
Mot de passe: admin123
```

---

## 🛠️ **Commandes Docker Essentielles**

### **Gestion des Services**
```bash
# Démarrer tous les services
npm run docker:up

# Arrêter tous les services  
npm run docker:down

# Redémarrer tous les services
npm run docker:restart

# Voir les logs en temps réel
npm run docker:logs

# Voir les logs d'un service spécifique
npm run docker:logs:backend
npm run docker:logs:frontend
npm run docker:logs:postgres

# État de santé des services
npm run docker:health
```

### **Développement et Debug**
```bash
# Accéder au terminal d'un container
npm run docker:exec:backend
npm run docker:exec:frontend

# Accéder à PostgreSQL directement
npm run docker:exec:postgres

# Reconstruire les images
npm run docker:build

# Reset complet (attention: supprime les données)
npm run docker:reset
```

### **Base de Données**
```bash
# Exécuter les migrations
npm run docker:migrate

# Reset de la base de données
npm run db:reset

# Sauvegarder la base
npm run db:backup

# Ouvrir Prisma Studio
npm run db:studio
```

### **Monitoring**
```bash
# Surveiller les performances
npm run monitor

# Sauvegarder les volumes
npm run backup:volumes
```

---

## 🏗️ **Architecture Docker**

### **Services et Dépendances**
```
┌─────────────────────────────────────────┐
│                Frontend                 │
│          (Next.js - Port 3000)         │
└────────────────┬────────────────────────┘
                 │ depends_on
┌────────────────▼────────────────────────┐
│                Backend                  │
│       (Node.js/Express - Port 4002)    │
└─────────────┬─────────────┬─────────────┘
              │             │
        depends_on    depends_on
              │             │
┌─────────────▼─────────────▼─────────────┐
│          PostgreSQL      Redis          │
│        (Port 55432)    (Port 6379)     │
└─────────────────────────────────────────┘
```

### **Volumes Persistants**
- `postgres_data` : Données PostgreSQL
- `redis_data` : Cache et sessions Redis
- `./backend/uploads` : Fichiers uploadés
- `./backend/logs` : Logs applicatifs

### **Réseau**
- Réseau interne : `logodouman-network` (172.20.0.0/16)
- Communication inter-services par nom de service
- Exposition ports uniquement nécessaires

---

## 🔧 **Configuration Spécifique Docker**

### **Variables d'Environnement**

#### **Frontend (.env.docker)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4002
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=production
```

#### **Backend (.env.docker)**
```bash
DATABASE_URL=postgresql://postgres:logodouman123@postgres:5432/logodouman
JWT_SECRET=logodouman-super-secret-jwt-key-docker-2024
REDIS_URL=redis://redis:6379
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
PORT=4002
```

### **Health Checks Intégrés**
Tous les services ont des health checks configurés :
- **PostgreSQL** : `pg_isready` toutes les 10s
- **Redis** : `redis-cli ping` toutes les 10s  
- **Backend** : `curl /health` toutes les 30s
- **Frontend** : `curl /` toutes les 30s

---

## 🐛 **Résolution de Problèmes**

### **Services qui ne Démarrent Pas**

```bash
# Vérifier les logs d'erreur
npm run docker:logs

# Vérifier l'état des services
docker-compose ps

# Redémarrer un service spécifique
docker-compose restart backend
```

### **Base de Données Inaccessible**

```bash
# Vérifier que PostgreSQL est prêt
docker-compose exec postgres pg_isready -U postgres

# Tester la connexion
docker-compose exec backend npx prisma db push

# En cas d'échec, reset complet
npm run docker:reset
```

### **Problèmes de Performance**

```bash
# Surveiller l'utilisation des ressources
npm run monitor

# Voir l'espace disque utilisé
docker system df

# Nettoyer les images inutilisées
docker system prune -f
```

### **Erreurs de Build**

```bash
# Nettoyer le cache Docker
docker builder prune -f

# Reconstruire sans cache
npm run docker:build

# En dernier recours, nettoyer complètement
npm run docker:clean
docker system prune -a -f
```

---

## 📊 **Monitoring et Maintenance**

### **Logs Structurés**
```bash
# Logs avec timestamps
docker-compose logs -f -t

# Logs des dernières 50 lignes
docker-compose logs --tail=50

# Logs d'une période spécifique
docker-compose logs --since=1h
```

### **Métriques de Performance**
```bash
# Stats en temps réel
docker stats

# Utilisation des volumes
docker system df -v

# Inspection détaillée d'un container
docker inspect logodouman-backend
```

### **Sauvegardes Automatisées**
```bash
# Sauvegarder la base de données
npm run db:backup

# Sauvegarder les volumes Docker
npm run backup:volumes

# Script de sauvegarde quotidienne (crontab)
0 2 * * * cd /path/to/logodouman && npm run db:backup
```

---

## 🚀 **Déploiement Production**

### **Variables d'Environnement Production**
```bash
# Copier et modifier les fichiers d'environnement
cp frontend/.env.docker frontend/.env.production
cp backend/.env.docker backend/.env.production

# Modifier les valeurs pour la production :
# - Changer les secrets JWT
# - Configurer les URLs de production
# - Activer HTTPS
# - Configurer les services externes
```

### **Optimisations Production**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    restart: always
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
  
  backend:
    restart: always
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### **Reverse Proxy (Nginx)**
```nginx
# nginx.conf
upstream frontend {
    server localhost:3000;
}

upstream backend {
    server localhost:4002;
}

server {
    listen 80;
    server_name logodouman.com;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔐 **Sécurité Docker**

### **Bonnes Pratiques Implémentées**
- ✅ **Utilisateurs non-root** dans tous les containers
- ✅ **Health checks** pour tous les services
- ✅ **Secrets** via variables d'environnement
- ✅ **Réseau isolé** entre services
- ✅ **Volumes montés** avec permissions appropriées

### **Sécurisation Supplémentaire**
```bash
# Scanner les vulnérabilités des images
docker scout quickview

# Analyser la configuration
docker-compose config --quiet

# Mettre à jour les images de base
docker-compose pull
npm run docker:build
```

---

## 📋 **Checklist de Validation Docker**

### **Installation**
- [ ] Docker et Docker Compose installés
- [ ] Ports 3000, 4002, 55432, 6379, 8080 libres
- [ ] 4 GB RAM disponible
- [ ] `npm run setup:docker` exécuté avec succès

### **Fonctionnalités**
- [ ] Site accessible sur http://localhost:3000
- [ ] Admin accessible avec login admin@logodouman.com
- [ ] API répond sur http://localhost:4002/health
- [ ] Base de données accessible via Adminer
- [ ] Produits affichés depuis l'API

### **Services**
- [ ] Tous les services "healthy" (`npm run docker:health`)
- [ ] Logs sans erreur critique (`npm run docker:logs`)
- [ ] Redémarrage possible (`npm run docker:restart`)
- [ ] Migration de données réussie

---

## 🎯 **Avantages Docker pour LogoDouman**

### **Pour le Développement**
- ✅ **Environnement identique** pour toute l'équipe
- ✅ **Setup en une commande** (`npm run setup:docker`)
- ✅ **Isolation complète** des services
- ✅ **Hot reload** préservé pour le développement

### **Pour la Production**
- ✅ **Scalabilité horizontale** facile
- ✅ **Déploiement reproductible**
- ✅ **Monitoring intégré** avec health checks
- ✅ **Rollback rapide** en cas de problème

### **Pour la Maintenance**
- ✅ **Sauvegardes simplifiées**
- ✅ **Logs centralisés** et structurés
- ✅ **Mises à jour isolées** par service
- ✅ **Debug facilité** avec accès containers

---

**🐳 LogoDouman est maintenant parfaitement intégré avec Docker Compose !**

*Guide mis à jour pour Docker - LogoDouman v2.1*
