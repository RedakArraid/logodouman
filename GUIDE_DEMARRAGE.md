# 🚀 Guide de Démarrage Rapide - LogoDouman Docker

## ⚡ Démarrage en 3 étapes

### 1. 🔧 Prérequis
- **Docker** installé et en cours d'exécution
- **Docker Compose** disponible
- **Git** (pour cloner le projet)

### 2. 🚀 Lancement
```bash
# Rendre le script exécutable
chmod +x start-complete.sh

# Lancer le projet complet
./start-complete.sh
```

### 3. 🌐 Accès
- **Site principal** : http://localhost:3000
- **Administration** : http://localhost:3000/admin
- **API Backend** : http://localhost:4002
- **Base de données** : http://localhost:8080

---

## 🔑 Compte Administrateur

- **Email** : `admin@logodouman.com`
- **Mot de passe** : `admin123`

---

## 🐛 En cas de problème

### Diagnostic automatique
```bash
# Rendre le script exécutable
chmod +x diagnostic.sh

# Diagnostic complet
./diagnostic.sh

# Diagnostic avec correction automatique
./diagnostic.sh --fix
```

### Redémarrage complet
```bash
# Redémarrage avec nettoyage
./start-complete.sh --clean
```

### Commandes Docker utiles
```bash
# Voir l'état des services
docker-compose ps

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter tous les services
docker-compose down
```

---

## 📊 Structure des Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Interface Next.js |
| Backend | 4002 | API Node.js |
| PostgreSQL | 55432 | Base de données |
| Redis | 6379 | Cache |
| Adminer | 8080 | Interface DB |

---

## 🎯 Fonctionnalités Testables

### Site E-commerce
- ✅ Catalogue de 4 produits
- ✅ Panier fonctionnel
- ✅ Recherche et filtres
- ✅ Design responsive

### Administration
- ✅ Gestion produits/catégories
- ✅ Analytics et statistiques
- ✅ Gestion des commandes
- ✅ Système de promotions

---

## 🚀 Prêt à l'emploi !

Votre plateforme e-commerce LogoDouman est maintenant opérationnelle avec toutes les corrections appliquées.
