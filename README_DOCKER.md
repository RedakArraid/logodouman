# 🐳 LogoDouman - Guide Docker Complet

## 🚀 Démarrage Ultra-Rapide

```bash
# 1. Configurer les permissions (une seule fois)
chmod +x setup-permissions.sh && ./setup-permissions.sh

# 2. Lancer le projet complet
./start-complete.sh

# 3. Accéder à l'application
# ✨ Voilà ! LogoDouman est prêt en 2-3 minutes
```

## 🌐 URLs d'Accès

| Service | URL | Description |
|---------|-----|-------------|
| 🛍️ **Site E-commerce** | http://localhost:3000 | Interface client |
| ⚙️ **Administration** | http://localhost:3000/admin | Panel admin |
| 🔧 **API Backend** | http://localhost:4002 | API REST |
| 🗄️ **Base de Données** | http://localhost:8080 | Adminer (Interface DB) |

## 🔑 Comptes de Test

### Administrateur
- **Email** : `admin@logodouman.com`
- **Mot de passe** : `admin123`

### Base de Données (Adminer)
- **Serveur** : `postgres`
- **Utilisateur** : `postgres`
- **Mot de passe** : `logodouman123`
- **Base** : `logodouman`

## 🛠️ Commandes Essentielles

### Gestion des Services
```bash
# Voir l'état des services
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (ATTENTION : perte de données)
docker-compose down -v
```

### Diagnostic et Maintenance
```bash
# Diagnostic complet
./diagnostic.sh

# Diagnostic avec correction automatique
./diagnostic.sh --fix

# Redémarrage complet avec nettoyage
./start-complete.sh --clean

# Reconstruction complète des images
docker-compose build --no-cache
```

## 🔍 Résolution de Problèmes

### Problème : Services ne démarrent pas
```bash
# 1. Diagnostic automatique
./diagnostic.sh

# 2. Vérifier Docker
docker --version
docker-compose --version
docker info

# 3. Nettoyer et redémarrer
./start-complete.sh --clean
```

### Problème : Erreurs de base de données
```bash
# 1. Vérifier PostgreSQL
docker-compose logs postgres

# 2. Recréer la base de données
docker-compose down
docker volume rm logodouman_postgres_data
./start-complete.sh
```

### Problème : Frontend inaccessible
```bash
# 1. Vérifier les logs
docker-compose logs frontend

# 2. Reconstruire l'image
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Problème : Backend API ne répond pas
```bash
# 1. Vérifier les logs
docker-compose logs backend

# 2. Tester la connectivité
curl http://localhost:4002/health

# 3. Redémarrer le backend
docker-compose restart backend
```

## 📊 Monitoring et Surveillance

### Vérifier la Santé des Services
```bash
# Santé globale
docker-compose ps

# Health checks détaillés
docker inspect logodouman-backend --format='{{.State.Health.Status}}'
docker inspect logodouman-frontend --format='{{.State.Health.Status}}'
docker inspect logodouman-postgres --format='{{.State.Health.Status}}'
```

### Métriques de Performance
```bash
# Utilisation des ressources
docker stats

# Espace disque utilisé
docker system df

# Volumes
docker volume ls
```

## 🔧 Configuration Avancée

### Variables d'Environnement

#### Frontend (`frontend/.env.docker`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4002
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=production
```

#### Backend (`backend/.env.docker`)
```env
DATABASE_URL=postgresql://postgres:logodouman123@postgres:5432/logodouman
REDIS_URL=redis://:redis123@redis:6379
JWT_SECRET=logodouman-super-secret-jwt-key-docker-2024
```

### Ports Configurés
- **3000** : Frontend Next.js
- **4002** : Backend API
- **5432** : PostgreSQL (interne)
- **55432** : PostgreSQL (externe)
- **6379** : Redis
- **8080** : Adminer

## 🚀 Déploiement Production

### Prérequis Production
1. **Serveur** avec Docker et Docker Compose
2. **Domaine** configuré
3. **SSL/TLS** (recommandé)
4. **Reverse Proxy** (nginx/traefik)

### Variables de Production
```bash
# Créer un .env.production
cp backend/.env.docker backend/.env.production

# Modifier les variables sensibles
# - JWT_SECRET (nouveau secret)
# - Database passwords
# - API URLs (domaine de production)
```

### Commandes de Déploiement
```bash
# Build des images de production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Démarrage production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📚 Architecture Docker

### Services et Dépendances
```
Frontend (Next.js) → Backend (Node.js) → PostgreSQL
                                      → Redis
                  → Adminer         → PostgreSQL
```

### Volumes Persistants
- `postgres_data` : Données PostgreSQL
- `redis_data` : Cache Redis
- `backend_uploads` : Fichiers uploadés
- `backend_logs` : Logs de l'application

### Réseau
- **Réseau isolé** : `logodouman-network`
- **Subnet** : `172.20.0.0/16`
- **Communication** : Noms de services internes

## 🎯 Tests et Validation

### Tests de Connectivité
```bash
# Test Frontend
curl -I http://localhost:3000

# Test Backend API
curl -I http://localhost:4002/health

# Test Base de données (via Adminer)
curl -I http://localhost:8080
```

### Tests Fonctionnels
1. **Naviguer** vers http://localhost:3000
2. **Voir les produits** affichés (4 produits)
3. **Ajouter au panier** et vérifier
4. **Accéder à l'admin** : http://localhost:3000/admin
5. **Se connecter** avec admin@logodouman.com / admin123
6. **Gérer produits** et catégories

## 🎉 Félicitations !

Votre plateforme e-commerce **LogoDouman** est maintenant opérationnelle avec Docker ! 

🚀 **Prêt pour le développement et la production !**
